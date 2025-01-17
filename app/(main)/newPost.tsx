import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Header from '@/components/Header'
import RichTextEditor from '@/components/RichTextEditor'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { getFileType, hp, wp } from '@/helpers/common'
import { getSupabaseFileUrl } from '@/services/imageService'
import { createOrUpdatePost, UpsertPostData } from '@/services/postService'
import { Post, User } from '@/types/supabase'
import { ResizeMode, Video } from 'expo-av'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { ImagePickerAsset } from 'expo-image-picker'
import type { MediaType } from 'expo-image-picker/src/ImagePicker.types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { RichEditor } from 'react-native-pell-rich-editor'

interface NewPostViewProps {
  user: User,
  post: Post,
  loading: boolean,
  file: ImagePickerAsset | null,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFile: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset | null>>
}
interface NewPostHeaderProps {
  user: User
}
interface NewPostUploadMediaProps {
  setFile: React.Dispatch<React.SetStateAction<ImagePickerAsset | null>>
}
interface NewPostDisplayMediaProps {
  file: ImagePickerAsset | null,
  setFile: React.Dispatch<React.SetStateAction<ImagePickerAsset | null>>
}

/**
 * This page handles `/newPost`
 * 
 * This component acts as the controller by supplying params into the view model for better testability.
 */
export default function _NewPostController() {
  const { user } = useAuth();
  const post = useLocalSearchParams();

  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<ImagePickerAsset | null>(null);  

  React.useEffect(() => {
    console.log("_NewPostController:: current file: " + JSON.stringify(file, null, 2));
  }, [file])

  return (
    <NewPostView 
      user={user}
      post={post}
      loading={loading}
      file={file}
      setLoading={setLoading}
      setFile={setFile}
      />
  )
}

/**
 * This component allows creating and editing of posts.
 * 
 * It displays the header.
 * It displays the text editor allowing the user to enter rich text.
 * It displays an input to add media with images or videos.
 * 
 * If this component is in editing mode, it requires post to be on the search params.
 * 
 * @testing use mock post object instead of using params.
 * 
 */
export function NewPostView({
  user,
  post,
  loading,
  file,
  setLoading,
  setFile
}: NewPostViewProps) {
  const router = useRouter();

  const bodyRef = React.useRef("");
  const editorRef = React.useRef<RichEditor | null>(null);

  const [editorLoaded, setEditorLoaded] = React.useState(false);

  let type = getFileType(post?.file?.slice(-3).toString());

  /**
   * This hook prefills the fields with the post data during edit mode.
   */
  React.useEffect(() => {
    if (editorLoaded && post.id) {      
      bodyRef.current = post.body.toString();           
      editorRef.current?.setContentHTML(post.body.toString());
      if (post.file) {
        setFile({
          width: 0,
          height: 0,
          uri: getSupabaseFileUrl(post.file as string),
          type: type
        });
      }      
    }
  }, [editorLoaded]);

  /**
   * This function handles the user submitting new posts.
   * 
   * If the body of the post is empty and there is no image/video, 
   * it alerts the user with "Invalid Post".
   * 
   * Otherwise it creates a post into the database.
   * 
   * If the post is successfully added, the user is taken to the home page.
   * Otherwise the user is alerted with "Post error".
   */
  async function onSubmit() {
    if (!bodyRef.current && !file) {
      Alert.alert("Invalid post", "Please choose a message or an image.");
      return;
    }
    const data: UpsertPostData = formatPostData(file, bodyRef.current, user?.id);

    setLoading(true);
    const response = await createOrUpdatePost(data);
    setLoading(false);

    if (response.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } else {
      Alert.alert("Post error", response.message);
    }
  }
  /**
   * This function formats the data in a json format.
   */
  function formatPostData(
    file: ImagePickerAsset | null, 
    body: string, 
    userId: string
  ): UpsertPostData {
    let data: UpsertPostData = {
      file: file,
      body: body,
      user_id: userId
    }
    if (post?.id) {
      data.id = post.id as string
    }
    return data;
  }
  /**
   * This function makes the editor respond as expected 
   * by closing the keyboard when outside of the editor is pressed.
   */
  function handleKeyboard() {
    if (editorRef.current?.isKeyboardOpen) {
      editorRef.current?.blurContentEditor();
    } 
  }

  const title = post?.id? "Update post" : "Create post";

  return (
    <ScreenWrapper bg="white" >
      <View style={styles.container}>
        <Pressable onPress={handleKeyboard}>
          <Header title={title} />
          <ScrollView contentContainerStyle={{ gap: 15 }}>  
            <NewPostHeader user={user} />
            <View style={styles.body} >
              <RichTextEditor 
                editorRef={editorRef}
                onChange={(body: string) => bodyRef.current = body} 
                setEditorLoaded={setEditorLoaded} />
              <NewPostDisplayMedia 
                file={file} 
                setFile={setFile} />
              <NewPostUploadMedia 
                setFile={setFile} />
              <Button 
                buttonStyle={{ height: hp(6.2)}}
                title={title}
                loading={loading}
                hasShadow={false}
                onPress={onSubmit} />
            </View>
          </ScrollView>
        </Pressable>
      </View> 
    </ScreenWrapper>
  )
}

/**
 * This component handles displaying the selected media.
 * 
 * For images, it displays the image.
 * For videos, it displays the video player that loops the video.
 * 
 * It displays a close icon that closes the display media when pressed.
 * 
 * @testing use a mock file
 */
function NewPostDisplayMedia({
  file, 
  setFile
}: NewPostDisplayMediaProps) {
  if (!file) {
    return null;
  }
  return (
    <View style={styles.file}>
      {file.type === 'video'? (
        <Video 
          style={{ flex: 1 }}
          source={{ uri: file.uri }}
          useNativeControls={true}
          resizeMode={ResizeMode.COVER}
          isLooping={true} />
      ): (
        <Image 
          source={{ uri: file.uri }}
          contentFit='cover'
          style={{ flex: 1 }} />
      )}
      <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
        <Icon name="delete" size={20} stroke="white" />
      </Pressable>
    </View>
  );
}

/**
 * This component handles allowing the user to upload media.
 * It allows the user to upload 1 image or video.
 */
function NewPostUploadMedia({
  setFile
}: NewPostUploadMediaProps) {
  /**
   * This function opens the user's image library and allows them to select
   * either an image or a video.
   */
  async function onPick(isImage: boolean) {
    let mediaConfig = {
      mediaTypes: "images" as MediaType,
      allowsEditing: true,
      aspect: [3, 3] as [number, number],
      quality: 0.5,
    }
    if (!isImage) {
      mediaConfig = {
        ...mediaConfig,
        mediaTypes: 'videos' as MediaType
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }
  return (
    <View style={styles.media}>
      <Text style={styles.addImageText}>Add to your post</Text>
      <View style={styles.mediaIcons}>
        <TouchableOpacity onPress={() => onPick(true)}>
          <Icon name='image' size={30} stroke={theme.colors.dark} />
          </TouchableOpacity>
        <TouchableOpacity onPress={() => onPick(false)}>
          <Icon name='video' size={35} strokeWidth={1.7} stroke={theme.colors.dark} />
          </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * This component handles rendering the user.
 * It displays the user's name and profile picture.
 */
function NewPostHeader({
  user
}: NewPostHeaderProps) {
  return (
    <View style={styles.header}> 
      <Avatar uri={user.image} size={hp(6.6)} rounded={theme.radius.xl} />
      <View style={{ gap: 2 }}> 
        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.publicText}>public</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 15
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  imageIcon: {
    borderRadius: theme.radius.sm
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous"
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 7
  },
  body: {
    gap: 15,
    paddingBottom: hp(50)
  }
})