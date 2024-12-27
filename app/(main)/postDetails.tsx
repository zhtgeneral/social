import { 
  StyleSheet,
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Text 
} from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Post } from '@/types/supabase';
import { createComment, fetchPostDetails } from '@/services/postService';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import Input from '@/components/Input';
import Icon from '@/assets/icons';

const debugging = true;

interface PostDetailsProps {
  init: boolean,
  loading: boolean,
  formattedPost: Post,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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

  const formattedPost = {
    ...post, 
    comments: [{ count: post?.comments?.length}]
  }

  React.useEffect(() => {
    getPostDetails();
  }, [])

  async function getPostDetails() {
    const response = await fetchPostDetails(postId);
    if (response.success) {
      setPost(response.data);
    }
    setInit(true);
    if (debugging) {
      console.log("postDetails::getPostDetails post details: " + JSON.stringify(response, null, 2));
    }
  }

  return (
    <PostDetailsView 
      init={init}
      loading={loading}
      formattedPost={formattedPost}      
      setLoading={setLoading}
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
  setLoading
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