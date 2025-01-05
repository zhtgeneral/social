import Icon from '@/assets/icons';
import CommentItem from '@/components/CommentItem';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PostCard from '@/components/PostCard';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/Supabase';
import { createNotification } from '@/services/notificationService';
import { createComment, fetchPostDetails, removeComment, removePost } from '@/services/postService';
import { getUserData } from '@/services/userService';
import { Comment, Notification, Post, User } from '@/types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { router, useLocalSearchParams } from 'expo-router';
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

interface CommentsAreaProps {
  comments: Comment[];
  onDeleteComment:  (comment: Comment) => Promise<void>;
  OpUserId: string,
  userId: string
}

/**
 * This page handles `/postDetails/:postId`.
 * 
 * It renders the post details by supplying the view component with parameters.
 * This improves testability of the view model.
 */
export default function _PostDetailsController() {
  const { post_id: postId } = useLocalSearchParams<{post_id: string}>();

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

      PostDetailsController.initPostDetails();

    return () => {
      supabase.removeChannel(commentsChannel);
    }
  }, []);

  class PostDetailsFormatter {
    /**
     * This function formats the post comment by getting the associated user.
     */
    public static async formatPostComment(newComment: Comment): Promise<Comment> {
      return await PostDetailsFormatter.assignUserForComment(newComment);
    }
    /**
     * @requries newComment is added into Supabase and foreign key relation to user is valid.     
     */
    private static async assignUserForComment(newComment: Comment) {
      const userAssignedComment = {...newComment};
      const userResponse = await getUserData(newComment.user_id);
      
      if (userResponse.success) {
        userAssignedComment.user = userResponse.data;
      } else {
        userAssignedComment.user = {};
      }

      if (debugging) {
        console.log("PostDetailsFormatter::assignUserForComment detected new comment with user: " + JSON.stringify(userAssignedComment, null, 2));
      }
      return userAssignedComment;
    }
  }

  class PostDetailsController {
    public static async initPostDetails() {
      const response = await fetchPostDetails(postId);
      if (response.success) {
        setPost(response.data);
      }
      setInit(true);
      if (debugging) {
        console.log("PostDetailsController::initPostDetails " + JSON.stringify(response.data, null, 2));
      }
    }
    /**
     * This handler sets the comments on a post details page.
     * 
     * It is called when supabase channels detects INSERT events on comments table for this post.
     * 
     * It takes the new comment, formats it, and puts in front of the old comments.
     */
    public static async handlePostEvents(payload: RealtimePostgresChangesPayload<Comment>) {
      if (payload.new) {
        const formattedComment = await PostDetailsFormatter.formatPostComment(payload.new);
        setPost((prevPost: Post) => {
          return {
            ...prevPost,
            comments: [formattedComment, ...prevPost.comments]
          }
        });
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
      setPost={setPost} />
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
  const { 
    post_id: postId, 
    comment_id: commentId 
  } = useLocalSearchParams<{post_id: string, comment_id: string}>();

  console.log("commentId: " + commentId);
  console.log("postId: " + postId);

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
      if (user.id !== formattedPost.user_id) {
        const notificationData: Notification = {
          sender_id: user.id,
          reciever_id: formattedPost.user_id,
          title: 'commented on your post',
          data: JSON.stringify({
            post_id: formattedPost.id,
            comment_id: response?.data?.id
          })
        }
        const notifcationResponse = await createNotification(notificationData);

        if (debugging) {
          console.log("notification response: " + JSON.stringify(notifcationResponse, null, 2))
        }
      }
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
  async function onDeletePost(post: Post) {
    const response = await removePost(post?.id);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Delete error", response?.message);
    }
  }
  async function onEditPost(post: Post) {
    router.back();
    router.push({ pathname: '/(main)/newPost', params: {...post}});
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
          hasShadow={false} 
          detailedMode={true} 
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost} />
        <View style={styles.inputContainer}>
          <Input 
            placeholder="Type comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={styles.input}
            inputRef={inputRef}
            onChangeText={(comment: string) => commentRef.current = comment} />
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
          <CommentsArea 
            onDeleteComment={onDeleteComment}
            OpUserId={formattedPost?.user_id}
            comments={formattedPost?.comments}
            userId={user?.id}
            />
          </View>
        </ScrollView>
      </View>
  )
}

/**
 * This component renders the comments.
 * 
 * For each comment, if the id matches the comment_id on the params, it is highlighted.
 * Otherwise it is displayed regularly.
 * 
 * If there are no comments, it shows "Be the first to comment!"
 */
function CommentsArea({
  onDeleteComment,
  userId,
  OpUserId,
  comments
}: CommentsAreaProps) {
  const { comment_id: commentId } = useLocalSearchParams<{comment_id: string}>();
  return (
    <>
      {
        comments?.map((c: Comment) => {
          /** can delete is true if the user is the owner of the post or the comment */
          const canDelete = (userId === OpUserId || c?.user_id === userId);
          const cid = c?.id?.toString();
          return (
            <CommentItem 
              key={cid} 
              item={c} 
              canDelete={canDelete}
              onDelete={onDeleteComment} 
              highlight={cid === commentId}/>
          )
        })
      }
      {
        (comments?.length === 0) && (
          <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
            Be the first to comment!
          </Text>
        )
      }
    </>
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
    fontWeight: theme.fonts.medium
  },
  loading: {
    height: hp(5.8),
    width: wp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }]
  }
})