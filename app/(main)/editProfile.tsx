import React from 'react'

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
import { CustomResponse } from '@/services'
import { getUserImageSource, uploadFile } from '@/services/imageService'
import { updateUser } from '@/services/userService'
import { User } from '@/types/supabase'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'

const debugging = true;

interface EditProfileViewProps {
  user: User,
  loading: boolean
  formData: User,
  onSubmit: () => Promise<void>
  updateFormData: (userData: any) => void;
}

interface EditProfilePictureProps {
  user: User,
  formData: User,
  updateFormData: (userData: any) => void;
}

/**
 * This component acts as a controller and passes params into the view model for better testability.
 */
export default function _EditProfileController() {
  const { user, setUserData } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<User>({
    name: null,
    image: null,
    bio: null,
    address: null,
    phone: null,
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        image: user.image,
        bio: user.bio,
        address: user.address,
        phone: user.phone,
      })
    }
  }, [user])

  class EditProfileController {
    /**
     * This function handles submitting updated user data.
     * 
     * It checks for any missing fields and alerts the user before returning.
     * 
     * If the image is updated, it uploads it before updating the user's data.
     * Otherwise it simply updates the user's data.
     * 
     * If the update is successful, it takes the user to the previous screen.
     */
    public static async onSubmit() {
      let image: string
      try {
        image = EditProfileController.handleValidateForm(formData);
      } catch (error: any) {
        Alert.alert('Incomplete profile', "Please fill all fields");
        return;
      }
  
      setLoading(true);
      let updateResponse: CustomResponse = { success: false };
      const imageDifferent = formData.image !== user.image;
  
      if (image && imageDifferent) {
        updateResponse = await EditProfileController.handleUpdateImageAndUser(image, formData);
      } else {
        updateResponse = await EditProfileController.handleUpdateUser(formData);
      }
      setLoading(false);
  
      if (updateResponse.success) {
        router.back();
      }
    }
    public static updateFormData(userData: any) {
      setFormData(userData);
    }
    /**
     * This function validates the updated data by throwing an error for empty inputs.
     */
    private static handleValidateForm(formData: User): string {
      let { name, phone, address, bio, image} = formData;
      if (!name || !phone || !address || !bio) {
        throw new Error();
      }
      return image;
    }
    /**
     * This function updates both the Image and the User.
     * 
     * It uploads image to Supabase under `profiles`.
     * If the upload is successful, it saves the image path to the form.
     * 
     * Then it updates the user in the database and the user state.
     */
    private static async handleUpdateImageAndUser(image: string, formData: User): Promise<CustomResponse> {
      const uploadResponse = await uploadFile('profiles', image, true);
      let updateResponse = { success: false };
  
      if (uploadResponse.success) {
        if (debugging) {
          console.log("editProfile::onSubmit got uploaded image: " + JSON.stringify(uploadResponse, null, 2));
        }
  
        formData.image = uploadResponse.data;
        updateResponse = await EditProfileController.handleUpdateUser(formData);
      } else {
        formData.image = null;
      } 
      return updateResponse;
    }
    /**
     * This function updates the user in the database.
     * 
     * If there is an update error in database, it alerts the user.
     * 
     * @requires layout needs to refetch user to get updated user.
     */
    private static async handleUpdateUser(formData: User, ): Promise<CustomResponse> {
      const updateResponse = await updateUser(user.id, formData); 
      if (updateResponse.success) {
        /** Note this was the only reliable to way to update the user's info */
        user.name = formData.name
        user.image = formData.image;
        user.bio = formData.bio;
        user.address = formData.address;
        user.phone = formData.phone;
        setUserData(user);
  
        if (debugging) {
          console.log("editProfile::handleUpdateUser updated user state: " + JSON.stringify(user, null, 2));
          console.log("editProfile::handleUpdateUser updated form state: " + JSON.stringify(formData, null, 2));
        }
  
      } else {
        Alert.alert("Update error", updateResponse.message);
      }
      return updateResponse;
    }
  }

  return (
    <EditProfileView 
      user={user}
      loading={loading}
      formData={formData}
      onSubmit={EditProfileController.onSubmit}
      updateFormData={EditProfileController.updateFormData} />
  )
}

/**
 * This page handles `/editProfile`.
 * 
 * It displays the avatar, the input fields, and the save button.
 * 
 * When the inputs are changed, they change the form
 * but don't save to database or global state.
 * 
 * Only when the save button is pressed, does the database and global state get changed.
 * 
 * @requires user needs to be logged in
 * 
 * @testing make formData and updateFormData function
 * @testing unique values for loading
 * @testing empty onSubmit function
 */
export function EditProfileView({
  user,
  updateFormData,
  formData,
  loading,
  onSubmit
}: EditProfileViewProps) {
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit profile" />
          <View style={styles.form}>
            <EditProfilePicture 
              user={user} 
              updateFormData={updateFormData} 
              formData={formData} />  
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please fill your profile details</Text>
            <Input 
              icon={<Icon name="user" />}
              placeholder='Enter your username'
              value={formData.name}
              onChangeText={(value: string) => updateFormData({ ...formData, name: value })} />
            <Input 
              icon={<Icon name="phone" />}
              placeholder='Enter your phone number'
              value={formData.phone}
              onChangeText={(value: string) => updateFormData({ ...formData, phone: value })} />
            <Input 
              icon={<Icon name="location" />}
              placeholder='Enter your address'
              value={formData.address}
              onChangeText={(value: string) => updateFormData({ ...formData, address: value })} />
            <Input 
              placeholder='Enter your bio'
              value={formData.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value: string) => updateFormData({ ...formData, bio: value })} />
            <Button 
              title="Update" 
              loading={loading} 
              onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
} 

/**
 * This component displays the profile picture with a button to edit it.
 */
function EditProfilePicture({
  user,
  formData,
  updateFormData
}: EditProfilePictureProps) {
  const [isLocalImage, setIsLocalImage] = React.useState(false);

  async function onPickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });
    if (!result.canceled) {
      updateFormData({...user, image: result.assets[0].uri});
      setIsLocalImage(true);
      
      if (debugging) {
        console.log("editProfile::EditProfilePicture formData: " + JSON.stringify(formData, null, 2));
      }
    } 
  }
  let imageSource = (isLocalImage)? formData.image : getUserImageSource(user?.image);
  return (
    <View style={styles.avatarContainer}>
      <Image 
        source={imageSource} 
        style={styles.avatar} />
      <Pressable style={styles.cameraIcon} onPress={onPickImage}>
        <Icon 
          name="camera" 
          size={20} 
          strokeWidth={2.5} />
        </Pressable>
    </View>
  );
}

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