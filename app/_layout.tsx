import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/Supabase";
import { CustomResponse } from '@/services/index';
import { getUserData } from "@/services/userService";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from 'expo-router';
import React from "react";

const debugging = true;

/**
 * This component provides app with Auth.
 */
export default function _Layout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

/**
 * This component sets the layout for the entire app.
 * 
 * It checks if the user is logged in. 
 * If the user is logged in, it sets the session in the global state
 * and takes the user to `/home`.
 * 
 * Otherwise it sets the global state of the user as `null`
 * and takes the user to `/welcome`.
 * 
 * @requires supabase needs to be setup
 */
function MainLayout() {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        if (debugging) {
          console.log("session user in MainLayout: " + JSON.stringify(session?.user, null, 2));
        }

        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    })    
  }, [])

  async function updateUserData(user: User) {
    let response: CustomResponse = await getUserData(user.id);
    if (response.success) {
      setUserData({...response.data});
    }
    if (debugging) {
      console.log('got user data in MainLayout: ' + JSON.stringify(response,null,2));
    }
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)/postDetails" options={{ presentation: 'modal' }} />
    </Stack>
  )
}