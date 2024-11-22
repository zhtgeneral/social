import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/Supabase";
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
  const { setAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event: any, session) => {
      if (session) {
        setAuth(session?.user);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    })    
    return () => {

    }
  }, [])
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}