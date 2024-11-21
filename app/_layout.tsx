import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router"

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
 */
const MainLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}