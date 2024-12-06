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
import { Post } from '@/types/supabase'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native'

var limit = 10;

/**
 * This page handles `/home`.
 * 
 * It displays the header with actions for viewing liked posts,
 * adding posts, and updating user info.
 * 
 * @requires user needs to be logged in to get here.
 */
const Home = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    async function getPosts() {
      const result = await fetchPosts();
      if (result.success) {
        setPosts(result.data);
      } else {
        Alert.alert("Posts error", result.message);
      }
      console.log("fetched limit: " + limit);
      limit += 10;
    }
    getPosts();
  }, [])

  // TODO remove
  // async function onLogout() {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     Alert.alert("Logout error", error.message);
  //   }
  // }
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Unlinkedout</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('/notifications')}>
              <Icon 
                name="heart" 
                size={hp(3.2)} 
                strokeWidth={2} 
                stroke={theme.colors.text}
                />
              </Pressable>
            <Pressable onPress={() => router.push('/newPost')}>
              <Icon 
                name="plus" 
                size={hp(3.2)} 
                strokeWidth={2} 
                stroke={theme.colors.text} 
                />
              </Pressable>
            <Pressable onPress={() => router.push('/profile')}>
              <Avatar 
                uri={user?.image} 
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
                />
              </Pressable>
            </View>
          </View>
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item: Post) => item.id.toString()}
          renderItem={
            ( info: ListRenderItemInfo<Post> ) => (
              <PostCard 
                item={info.item}
                currentUser={user}
              /> 
            )
          }
          ListFooterComponent={(
            <View style={{ marginVertical: !posts.length? 200: 30 }}>
              <Loading />
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  )
}

export default Home

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