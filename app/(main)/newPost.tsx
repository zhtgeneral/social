import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Header from '@/components/Header'
import RichTextEditor from '@/components/RichTextEditor'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { hp, wp } from '@/helpers/common'
import { getSupabaseFileUrl } from '@/services/imageServices'
import { ResizeMode, Video } from 'expo-av'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { ImagePickerAsset } from 'expo-image-picker'
import type { MediaType } from 'expo-image-picker/src/ImagePicker.types'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading ] = useState(false);
  const [file, setFile] = useState<ImagePickerAsset | null>(null);

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
    console.log('file selected NewPost::onPick: ', JSON.stringify(result, null, 2));
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function onSubmit() {

  }
  function isLocalFile(file: ImagePickerAsset) {
    return typeof file === 'object';
  }

  function getFileType(file: ImagePickerAsset | null) {
    if (!file) {
      return null;
    }
    if (isLocalFile(file)) {
      return file.type;
    }
  }

  function getFileUri(file: ImagePickerAsset | null): string {
    if (!file) {
      return "";
    }
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file.uri)?.uri || "";
  }

  return (
    <ScreenWrapper bg="white" >
      <View style={styles.container}>
        <Header title="Create post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>  
          {/* Header */}
            <View style={styles.header}> 
              <Avatar 
                uri={user.image}
                size={hp(6.6)}
                rounded={theme.radius.xl}
              />
              <View style={{ gap: 2 }}> 
                <Text style={styles.username}>
                  {user && user.name}
                </Text>
                <Text style={styles.publicText}>
                  public
                </Text>
              </View>
            </View>
          {/* Body */}
          <View style={styles.body} >
            {/* Text editor */}
            <View>
              <RichTextEditor 
                editorRef={editorRef}
                onChange={(body: string) => bodyRef.current = body}
              />
            </View>
            {/* Displayed media */}
            {file && (
              <View style={styles.file}>
                {getFileType(file) === 'video'? (
                  <Video 
                    style={{ flex: 1 }}
                    source={{ uri: getFileUri(file) }}
                    useNativeControls={true}
                    resizeMode={ResizeMode.COVER}
                    isLooping={true}
                  />
                ): (
                  <Image 
                    source={{ uri: getFileUri(file) }}
                    contentFit='cover'
                    style={{ flex: 1 }}
                  />
                )}
                <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                  <Icon 
                    name="delete" 
                    size={20} 
                    stroke="white" 
                  />
                </Pressable>
              </View>
            )}
            {/* Upload media */}
            <View style={styles.media}>
              <Text style={styles.addImageText}>
                Add to your post
              </Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={() => onPick(true)}>
                  <Icon 
                    name='image' 
                    size={30} 
                    stroke={theme.colors.dark} 
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPick(false)}>
                  <Icon 
                    name='video' 
                    size={35} 
                    strokeWidth={1.7}
                    stroke={theme.colors.dark} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <Button 
          buttonStyle={{ height: hp(6.2)}}
          title="Create post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View> 
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold as 600,
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
    fontWeight: theme.fonts.semibold as 600,
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
    fontWeight: theme.fonts.medium as 500,
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
    fontWeight: theme.fonts.semibold as 600,
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