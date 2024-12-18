import Icon from '@/assets/icons';
import { hp } from '@/helpers/common';
import { getSupabaseFileUrl } from '@/services/imageService';
import { Post, User } from '@/types/supabase';
import { ResizeMode, Video } from 'expo-av'; // TODO migrate to expo-video
import { Image } from 'expo-image';
import moment from 'moment';
import React from 'react';
import { LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { theme } from '../constants/theme';
import Avatar from './Avatar';

const debugging = false;

interface PostCardProps {
  item: Post,
  currentUser: User,
  hasShadow?: boolean
}
interface PostCardHeaderProps {
  item: Post
}
interface PostCardBodyProps {
  item: Post
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
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <PostCardHeader item={item} />
      <PostCardBody item={item} />
      <PostCardFooter />
    </View>
  )
}

export default PostCard;

/**
 * This component renders the post card's header.
 * 
 * It displays OP's avatar, the date of the post, and an options button.
 */
const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  item
}) => {
  if (debugging) {
    console.log("PostCard::PostCardHeader got item: " + JSON.stringify(item, null, 2));
  }

  const createdAt = moment(item?.created_at).format('MMM D');  

  function openPostDetails() {} // TODO

  return (
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
  );
}
/**
 * This component handles rendering the body of a post.
 * 
 * It displays the rich text as HTML.
 * 
 * It displays the image or video of the post if specified.
 */
const PostCardBody: React.FC<PostCardBodyProps> = ({
  item
}) => {
  return (
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
  )
}
/**
 * This component renders icons for liking, commenting, and sharing the post.
 */
const PostCardFooter = () => {
  const liked = true;
  const likes = [];
  return (
    <View style={styles.footer}>
      <View style={styles.footerButton}>
        <TouchableOpacity>
          <Icon 
            name="heart" 
            size={24} 
            fill={liked? theme.colors.rose: 'transparent'}
            stroke={liked? theme.colors.rose: theme.colors.textLight} 
            />
          </TouchableOpacity>
        <Text
          >{likes.length}
          </Text>
        </View>
      <View style={styles.footerButton}>
        <TouchableOpacity>
          <Icon 
            name="comment" 
            size={24} 
            stroke={theme.colors.textLight} 
            />
          </TouchableOpacity>
          <Text>0</Text>
        </View>
      <View style={styles.footerButton}>
        <TouchableOpacity>
          <Icon 
            name="share" 
            size={24} 
            stroke={theme.colors.textLight} 
            />
          </TouchableOpacity>
        </View>
    </View>
  );
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
    marginHorizontal: 4,
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
const shadowStyle = {
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 1
}
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