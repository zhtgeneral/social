import Icon from '@/assets/icons'
import Avatar from '@/components/Avatar'
import Header from '@/components/Header'
import RichTextEditor from '@/components/RichTextEditor'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { hp, wp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading ] = useState(false);
  const [file, setFile] = useState(false);

  function onPick() {
    
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
          {/* Text editor */}
          <View style={styles.editor}>
            <View>
              <RichTextEditor 
                editorRef={editorRef}
                onChange={(body: string) => bodyRef.current = body}
              />
            </View>
            <View style={styles.media}>
              <Text style={styles.addImageText}>
                Add to your post
              </Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={onPick}>
                  <Icon 
                    name='image' 
                    size={30} 
                    stroke={theme.colors.dark} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 20,
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
    right: 10
  },
  editor: {
    paddingBottom: hp(50)
  }
})