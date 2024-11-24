import React, { useEffect, useState } from 'react'

import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Image } from 'expo-image'

import Icon from '@/assets/icons'
import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { hp, wp } from '@/helpers/common'
import { getUserImageSource, uploadFile } from '@/services/imageServices'
import { updateUser } from '@/services/userService'
import { User } from '@/types/supabase'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'

const EditProfile = () => {
  const { user, setUserData } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formUser, setformUser] = useState<User>({
    name: null,
    phoneNumber: null,
    image: null,
    bio: null,
    address: null
  })

  useEffect(() => {
    if (user) {
      setformUser({
        name: user.name,
        phone: user.phone,
        image: user.image,
        address: user.address,
        bio: user.bio
      })
    }
  }, [user])
  async function onPickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setUserData({...user, image: result.assets[0].uri});
    } 
  }

  /**
   * This function handles submitting updated user data.
   * 
   * It checks for any missing fields and alerts the user before returning.
   * 
   * Otherwise it sets the state as loading and updates the user in the database.
   * If the response is successful, it sets the global state of the user.
   */
  async function onSubmit() {
    let { name, phone, address, bio, image} = formUser;
    if (!name || !phone || !address || !bio) {
      Alert.alert('Incomplete profile', "Please fill all fields");
      return;
    }
    setLoading(true);

    if (image) {
      let imageResponse = await uploadFile('profiles', image, true);
      if (imageResponse.success) {
        user.image = imageResponse.data;
      } else {
        user.image = null;
      }
    }
    const response = await updateUser(user.id, user); 
    
    if (response.success) {
      setUserData({...user, ...formUser});
      setLoading(false);
      router.back();
      return;
    } 
    if (response.message) {
      Alert.alert("Update error", response.message);
    }

    setLoading(false);
  }

  let imageSource = (formUser.image)? formUser.image :getUserImageSource(user?.image);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit profile" />
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image 
                source={imageSource} 
                style={styles.avatar}
              />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon 
                  name="camera" 
                  size={20} 
                  strokeWidth={2.5} 
                />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input 
              icon={<Icon name="user" />}
              placeholder='Enter your username'
              value={formUser.name}
              onChangeText={(value: string) => setformUser({ ...formUser, name: value })}
            />
            <Input 
              icon={<Icon name="phone" />}
              placeholder='Enter your phone number'
              value={formUser.phone}
              onChangeText={(value: string) => setformUser({ ...formUser, phone: value })}
            />
            <Input 
              icon={<Icon name="location" />}
              placeholder='Enter your address'
              value={formUser.address}
              onChangeText={(value: string) => setformUser({ ...formUser, address: value })}
            />
            <Input 
              placeholder='Enter your bio'
              value={formUser.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value: string) => setformUser({ ...formUser, bio: value })}
            />
            <Button title="Update" loading={loading} onPress={onSubmit}/>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center'
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  form: {
    gap: 18,
    marginTop: 20
  },
  input: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15
  }
})