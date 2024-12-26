import Icon from '@/assets/icons';
import Avatar from '@/components/Avatar';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/Supabase';
import { User } from '@/types/supabase';
import { useRouter } from 'expo-router';
import React from 'react';
import { 
  Alert, 
  Pressable, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View
} from 'react-native';

interface ProfileMainProps {
  user: User
}
interface ProfileBannerProps {
  user: User
}

/**
 * This page handles `/profile`.
 */
export default function Profile() {
  const { user } = useAuth();
  return (
    <ScreenWrapper bg="white" >
      <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
        <ProfileHeader />
        <View style={styles.container} >
          <View style={{ gap: 15 }}>
            <ProfileMain user={user} />
            <ProfileBanner user={user} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

/**
 * This component displays the header of the profile.
 * 
 * It shows a back button and a logout button.
 */
function ProfileHeader() {
  async function onLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout error", error.message);
    }
  }
  async function handleLogout() {
    Alert.alert("Confirm logout?", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log('pressed'),
        style: 'cancel'
      },
      {
        text: "Log out",
        onPress: () => onLogout(),
        style: 'destructive'
      }
    ])
  }
  return (
    <View>
      <Header title="profile" mb={30} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" stroke={theme.colors.rose} />
      </TouchableOpacity>
    </View>
  );
}
/**
 * This component renders the details of the user.
 * 
 * It displays the field for the email and the value.
 *  
 * If the user has fields for `phone`, it displays the field for phone and the value.
 * 
 * If the user has fields for `bio`, it displays the field for bio and the value.
 * 
 * @testing use a mock user.
 */
function ProfileBanner({
  user
}: ProfileBannerProps) {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.info}>
        <Icon name="mail" size={20} color={theme.colors.textLight} /> 
        <Text style={styles.infoText}>{user?.email}</Text>
        </View>
      {user?.phone && (
        <View style={styles.info}>
          <Icon name="phone" size={20} color={theme.colors.textLight} /> 
          <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
      {user?.bio && (
        <View style={styles.info}>
          <Text style={styles.infoText}>About me: {user.bio}</Text>
          </View>
        )}
    </View>
  );
}
/**
 * This component renders the profile picture and the location.
 * 
 * It displays a button on the profile picture to edit profile details.
 */
function ProfileMain({
  user
}: ProfileMainProps) {
  const router = useRouter();
  return (
    <View style={{ gap: 5 }}>
      <View style={styles.avatarContainer} >
        <Avatar uri={user?.image} size={hp(12)} rounded={theme.radius.xxl * 1.4} />
        <Pressable style={styles.editIcon} onPress={() => router.push('/editProfile')} >
          <Icon name="edit" strokeWidth={2.5} size={20} />
          </Pressable>
        </View>
      <View style={{ alignItems: 'center', gap: 4 }}> 
        <Text style={styles.userName}>{user && user.name}</Text>
        <Text style={styles.infoText}>{user && user.address}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  headerShape: {
    width: wp(100),
    height: hp(20)
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.fonts.medium as 500,
    color: theme.colors.textDark
  },
  info: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 10
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium as 500,
    color: theme.colors.textLight
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2'
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
  }
})