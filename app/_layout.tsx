import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/Supabase";
import { getUserData, Response } from "@/services/userService";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from 'expo-router';
import { useEffect } from "react";

/**
 * This component provides app with Auth.
 */
const _Layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}
export default _Layout;

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
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event: any, session) => {
      if (session) {
        console.log("session user in MainLayout: " + JSON.stringify(session?.user, null, 2));
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
    let response: Response = await getUserData(user.id);
    if (response.success) {
      setUserData({...response.data});
    }
    console.log('got user data in MainLayout: ' + JSON.stringify(response,null,2));
  }
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}