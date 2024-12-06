import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Post, User } from '@/types/supabase'
import { useRouter } from 'expo-router'
import { theme } from '../constants/theme';
import { hp } from '@/helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image';
import { getSupabaseFileUrl } from '@/services/imageService';
import { ResizeMode, Video } from 'expo-av'; // TODO migrate to expo-video
import { LogBox } from 'react-native';

interface PostCardProps {
  item: Post,
  currentUser: User,
  hasShadow?: boolean
}

/* Ignore warning messages in client created by RenderHtml */
LogBox.ignoreLogs([
  'TNodeChildrenRenderer: Support for defaultProps',
  'MemoizedTNodeRenderer: Support for defaultProps',
  'TRenderEngineProvider: Support for defaultProps'
]);

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  hasShadow = true
}) => {
  const router = useRouter();

  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1
  }
  const createdAt = moment(item?.created_at).format('MMM D');

  function openPostDetails() {

  }
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        <View style={styles.userInfo}> 
          <Avatar 
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
            />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
            </View>
          </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon 
            name="threeDotsHorizontal" 
            size={hp(3.4)}
            strokeWidth={1}
            stroke={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      <View style={styles.content}>
        <View style={styles.postBody}> 
          {item?.body && (
            /** Causes MemoizedTNodeRenderer, TRenderEngineProvider, TNodeChildrenRenderer warnings */
            <RenderHtml 
              contentWidth={hp(100)}
              source={{ html: item?.body || ""}}
              tagsStyles={tagStyles ?? {}}
            />
          )}
          {item?.file && item?.file?.includes('postImages') && (
            <Image 
              source={getSupabaseFileUrl(item?.file)} 
              transition={100}
              style={styles.postMedia}
              contentFit='cover'
            />
          )}
          {item?.file && item?.file.includes('postVideos') && (
            <Video 
              style={[styles.postMedia, { height: hp(30) }]}
              source={{ uri: getSupabaseFileUrl(item?.file) }}
              useNativeControls={true}
              resizeMode={ResizeMode.COVER}
              isLooping={true}
            />
          )}
          </View>
        </View>
    </View>
  )
}

export default PostCard

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75)
}
const tagStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark
  },
  h4: {
    color: theme.colors.dark
  }
}


const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium as 500
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium as 500
  },
  content: {
    gap: 10
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  postBody: {
    marginLeft: 5,
    gap: 10
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8)
  }
})