import { Stack } from "expo-router"

/**
 * This component configures the layout to remove headers
 */
const _Layout = () => {
  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    />
  )
}
export default _Layout;