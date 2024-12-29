import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Loading from '@/components/Loading'
import PostCard from '@/components/PostCard'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { hp, wp } from '@/helpers/common'
import { supabase } from '@/lib/Supabase'
import { fetchPosts } from '@/services/postService'
import { getUserData } from '@/services/userService'
import { Comment, Post, User } from '@/types/supabase'
import { RealtimePostgresChangesPayload, RealtimePostgresDeletePayload } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

const debugging = true;

var numPosts = 3;
var amount = 3;

interface HomeProps {
  posts: Post[],
  hasMorePosts: boolean,
  handleEnd: () => void
}

interface HomeHeaderProps {
  user: User
}

/**
 * This page handles `/home`.
 * 
 * It renders the post details by supplying the component with inputs.
 * This improves testability of the rendered component.
 */
export default function _HomeController() {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [hasMorePosts, setHasMorePosts] = React.useState(true);

  /**
   * This hook makes the home page responsive to any changes to uploaded posts
   */
  React.useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'posts'
      }, HomeController.handlePostEvents)
      .subscribe();

    const commentChannelAdd = supabase 
      .channel('comments_main_add')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `user_id=eq.${user?.id}`
      }, HomeController.handleAddCommentEvents)
      .subscribe();

      const commentChannelDelete = supabase 
      .channel('comments_main_delete')
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'comments',
        filter: `user_id=eq.${user?.id}`
      }, HomeController.handleDeleteCommentEvents)
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(commentChannelAdd);
      supabase.removeChannel(commentChannelDelete);
    }
  }, []);

  

  class PostDataFormatter {
    /**
     * This function fills in the user and comments count for a post.
     */
    public static async formatNewPost(newPost: Post): Promise<Post> {
      const userAssignedPost = await PostDataFormatter.assignUserForPost(newPost);
      const commentsAssignedPost = PostDataFormatter.setCommentsForPost(userAssignedPost);
      return commentsAssignedPost;
    }
    /**
     * @requries newPost is newly added into Supabase and foreign key relation to user is valid.
     */
    private static async assignUserForPost(newPost: Post) {
      const userAssignedPost = {...newPost};
      const userResponse = await getUserData(newPost.user_id);

      if (userResponse.success) {
        userAssignedPost.user = userResponse.data;
      } else {
        userAssignedPost.user = {}
      }
      
      if (debugging) {        
        console.log("Home::assignUserForPost new post detected with user: " + JSON.stringify(newPost, null, 2));
      }

      return userAssignedPost;
    }
    /**
     * @requires newPost is newly added into Supabase and has 0 comments.
     */
    private static setCommentsForPost(newPost: Post) {
      const commentsAssignedPost = {...newPost};
      commentsAssignedPost.comments = [{ count: 0 }];
      return commentsAssignedPost;
    }
  }

  class HomeController {
    /**
     * This function gets more posts until no more posts can be gotten
     */
    public static async getMorePosts() {
      if (!hasMorePosts) {
        return;
      }
        
      const result = await fetchPosts(numPosts);
      if (result.success) {
        setPosts(result.data);
        if (HomeController.endReached(result.data)) {
          HomeController.disableFuturePostFetch();
        }
      } else {
        Alert.alert("Posts error", result.message);
      }

      if (debugging) {
        console.log("fetched limit: " + numPosts);
      }

      numPosts += amount;
    }
    public static handleEnd() {
      HomeController.getMorePosts();

      if (debugging) {
        console.log("End of posts reached");
      }
    }
    public static async handleDeleteCommentEvents(payload: RealtimePostgresDeletePayload<Comment>) {
      if (payload.old) {
        const postId = payload.old.post_id;
        setPosts((currentPosts: Post[]) =>
          currentPosts.map((p: Post) => {
            if (p.id === postId && p.comments[0].count > 0) {
              return {...p, comments: [{ count: p.comments[0].count - 1 }] }
            }
            return p;
          })
        );
      }
    }
    public static async handleAddCommentEvents(payload: RealtimePostgresChangesPayload<Comment>) {
      if (payload.new) {
        const postId = payload.new?.post_id;
        setPosts((currentPosts: Post[]) => 
          currentPosts.map((p: Post) => {
            if (p.id === postId) {
              return {...p, comments: [{ count: p.comments[0].count + 1 }] }
            } else {
              return p;
            }
          })
        );
      }
    }
    /**
     * This callback function sets the posts on the home page.
     * 
     * It is called whenever supabase channels detects an INSERT event.
     * 
     * It fills the user for the new post and brings the new post on top of the feed.
     */
    public static async handlePostEvents(payload: RealtimePostgresChangesPayload<Post>) {
      if (HomeController.validateNewEvent(payload)) {
        const formattedPost = await PostDataFormatter.formatNewPost(payload.new);
        setPosts((previousPosts) => [formattedPost, ...previousPosts]);

        if (debugging) {
          console.log("HomeController::handlePostEvents new post: " + JSON.stringify(formattedPost, null, 2));
        }
      } 
    }

    private static endReached(data: Post[]) {
      return posts.length === data.length;
    }
    private static disableFuturePostFetch() {
      setHasMorePosts(false);
    }
    private static validateNewEvent(payload: RealtimePostgresChangesPayload<Post>) {
      return payload.eventType == "INSERT" && payload.new?.id;
    }
  }

  return (
    <HomeView 
      posts={posts}
      hasMorePosts={hasMorePosts}
      handleEnd={HomeController.handleEnd} />
  )
}

/**
 * This component renders the home header and all the posts.
 * 
 * It loads posts in chunks of `limit` and loads posts in real time from supabase.
 * 
 * @requires user needs to be logged in to get here.
 * @testing use mocks for post and hasMorePosts and keep handleEnd empty
 */
function HomeView({
  posts,
  hasMorePosts,
  handleEnd
}: HomeProps) {
  const { user } = useAuth();

  function renderItem(info: ListRenderItemInfo<Post>) {
    // console.log("HomeView::renderItem:: rendered item: " + JSON.stringify(info, null, 2));
    const post = info?.item;
    return (
      <PostCard 
        item={post} 
        currentUser={user} /> 
    )
  }
  function listFooter() {
    if (hasMorePosts) {
      return (
        <View style={{ marginVertical: !posts?.length? 200: 50 }}>
          <Loading />
        </View>
      )
    } else {
      return (
        <View style={{ marginVertical: 30 }}>
          <Text style={styles.noPosts}>No more posts</Text>
        </View>
      )
    }
  }
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <HomeHeader user={user} />
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item: Post) => item?.id?.toString()}
          renderItem={renderItem}
          onEndReached={handleEnd}
          onEndReachedThreshold={0}
          ListFooterComponent={listFooter} />
      </View>
    </ScreenWrapper>
  )
}

/**
 * This component displays the header with actions for viewing liked posts,
 * adding posts, and updating user info.
 * 
 * It displays the brand name.
 */
function HomeHeader({
  user
}: HomeHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Unlinkedout</Text>
      <View style={styles.icons}>
        <Pressable onPress={() => router.push('/notifications')}>
          <Icon 
            name="heart" 
            size={hp(3.2)} 
            strokeWidth={2} 
            stroke={theme.colors.text} />
          </Pressable>
        <Pressable onPress={() => router.push('/newPost')}>
          <Icon 
            name="plus" 
            size={hp(3.2)} 
            strokeWidth={2} 
            stroke={theme.colors.text} />
          </Pressable>
        <Pressable onPress={() => router.push('/profile')}>
          <Avatar 
            uri={user?.image} 
            size={hp(4.3)}
            rounded={theme.radius.sm}
            style={{ borderWidth: 2 }} />
          </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold as 700
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold as 700
  }
})