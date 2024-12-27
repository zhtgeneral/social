import Icon from '@/assets/icons';
import CommentItem from '@/components/CommentItem';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PostCard from '@/components/PostCard';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/Supabase';
import { createComment, fetchPostDetails, removeComment } from '@/services/postService';
import { getUserData } from '@/services/userService';
import { Comment, Post } from '@/types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const debugging = true;

interface PostDetailsProps {
  init: boolean,
  loading: boolean,
  formattedPost: Post,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPost: React.Dispatch<Post>
}

/**
 * This page handles `/postDetails/:postId`.
 * 
 * It renders the post details by supplying the view component with parameters.
 * This improves testability of the rendered component.
 */
export default function _PostDetailsController() {
  const { postId } = useLocalSearchParams<{postId: string}>();

  const [init, setInit] = React.useState(false);
  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(false);

  /**
   * This hook makes the post details page responsive to uploaded comments on a post.
   * 
   * Removing comments is already responsive with PostDetailsView::onDeleteComment.
   */
  React.useEffect(() => {
    const commentsChannel = supabase
      .channel('comments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments',
        filter: `post_id=eq.${postId}`
      }, PostDetailsController.handlePostEvents)
      .subscribe();

      PostDetailsController.getPostDetails();

    return () => {
      supabase.removeChannel(commentsChannel);
    }
  }, []);

  class PostDetailsController {
    public static async getPostDetails() {
      const response = await fetchPostDetails(postId);
      if (response.success) {
        setPost(response.data);
      }
      setInit(true);
      if (debugging) {
        console.log("postDetails::getPostDetails post details: " + JSON.stringify(response, null, 2));
      }
    }
    /**
     * This callback function sets the comments on a post details page.
     * 
     * It is called whenever supabase channels detects an INSERT event on the comments table.
     * 
     * It fills the user for the new cmment and brings the new post on top of the feed.
     */
    public static async handlePostEvents(payload: RealtimePostgresChangesPayload<Comment>) {
      if (payload.new) {
        const newComment = {...payload.new};
        await PostDetailsController.setUserForComment(newComment);
        setPost((prevPost: Post) => {
          return {
            ...prevPost,
            comments: [newComment, ...prevPost.comments]
          }
        });
      }
    }
    /**
     * This function sets the user for the new comment.
     * 
     * If the request for getting the user fails, it sets the user as null.
     */
    private static async setUserForComment(newComment: Comment) {
      if (debugging) {
        console.log("PostDetails::setUserForComment new comment detected: " + JSON.stringify(newComment, null, 2));
      }

      const userResponse = await getUserData(newComment.user_id);
      newComment.user = userResponse.success? userResponse.data: {};

      if (debugging) {
        console.log("PostDetails::setUserForComment new comment with user: " + JSON.stringify(newComment, null, 2));
      }
    }
  }

  if (!init) {
    return null;
  }
  return (
    <PostDetailsView 
      init={init}
      loading={loading}
      formattedPost={post}      
      setLoading={setLoading}
      setPost={setPost}
    />
  )
}

/**
 * This component renders the details of a post.
 * 
 * If `init` is false, it shows a loading indicator and nothing else.
 * 
 * If `formattedPost` is null, it shows "Post not found." and nothing else.
 * 
 * Otherwise it shows a post card and a comments area.
 * 
 * The comments area has an input to add comment and displays all the comments.
 * 
 * If `loading` is true, the share button renders a loading icon and cannot be interacted with.
 */
function PostDetailsView({
  init,
  loading,
  formattedPost,  
  setLoading,
  setPost
}: PostDetailsProps) {
  const { user } = useAuth();
  const { postId } = useLocalSearchParams<{postId: string}>();

  const inputRef = React.useRef<TextInput>(null);
  const commentRef = React.useRef("");

  async function onNewComment() {
    if (!commentRef.current) {
      return;
    }
    const data = {
      user_id: user.id,
      post_id: postId,
      text: commentRef.current
    }

    setLoading(true);
    const response = await createComment(data);
    setLoading(false);

    if (response.success) {
      // TODO send notification later
      inputRef.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment error", response.message);
    }
    if (debugging) {
      console.log("PostDetails::onNewComment got comment: " + JSON.stringify(response, null, 2));
    }
  }
  async function onDeleteComment(comment: Comment) {
    const response = await removeComment(comment?.id);
    if (response.success) {
      setPost((prev: Post) => {
        const updatedPost = {...prev};
        updatedPost.comments = updatedPost.comments.filter((c: Comment) => c.id !== comment.id);
        return updatedPost;
      });
    }
    if (debugging) {
      console.log("PostDetailsView::onDeleteComment: delete reponse: " + JSON.stringify(response, null, 2));
    }
  }

  if (debugging) {
    console.log("PostDetails::PostDetailsView formatted post: " + JSON.stringify(formattedPost, null, 2));
  }

  if (!init) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    )
  }
  if (!formattedPost) {
    return (
      <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
        <Text style={styles.notFound}>Post not found.</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <PostCard 
          item={formattedPost} 
          currentUser={user} 
          numComments={formattedPost?.comments?.length}
          hasShadow={false} 
          showMoreActions={false}
          />
        <View style={styles.inputContainer}>
          <Input 
            placeholder="Type comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={styles.input}
            inputRef={inputRef}
            onChangeText={(comment: string) => commentRef.current = comment}
          />
          {
            loading? (
              <View style={styles.loading}>
                <Loading size="small"/>
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )
          }
        </View>
        <View style={{ marginVertical: 15, gap: 18 }}>
        {
          formattedPost?.comments?.map((comment: Comment) => {
            /** can delete is true if the user is the owner of the post or the comment */
            const canDelete = user?.id === formattedPost?.user_id || comment?.user_id === user?.id;
            return (
              <CommentItem 
                key={comment?.id?.toString()} 
                item={comment} 
                canDelete={canDelete}
                onDelete={onDeleteComment}
              />
            )
          })
        }
        {
          (formattedPost?.comments?.length === 0) && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be the first to comment!
            </Text>
          )
        }
      </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(7)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  input: { 
    flex: 1, 
    height: hp(6.2), 
    borderRadius: theme.radius.xl 
  },
  list: {
    paddingHorizontal: wp(4)
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8)
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium as 500
  },
  loading: {
    height: hp(5.8),
    width: wp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }]
  }
})