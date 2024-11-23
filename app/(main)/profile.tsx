import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Router, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { User } from '@supabase/supabase-js';
import Header from '@/components/Header';
import { hp, wp } from '@/helpers/common';
import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/Supabase';

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  return (
    <ScreenWrapper bg="white" >
      <UserHeader user={user} router={router} />
    </ScreenWrapper>
  )
}

interface UserHeaderProps {
  user: User | null,
  router: Router
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user, 
  router
}) => {
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
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <View>
        <Header 
          title="profile" 
          showBackButton={true} 
        />
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Icon name="logout" stroke={theme.colors.rose} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

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
  editIcons: {
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