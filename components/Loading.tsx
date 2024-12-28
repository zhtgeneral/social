import { theme } from '@/constants/theme'
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native'

interface LoadingProps {
  size?: ActivityIndicatorProps["size"],
  color?: ActivityIndicatorProps["color"]
}

/**
 * This component renders a custom loading spinner animation.
 */
export default function Loading({
  size = "large",
  color = theme.colors.primary
}: LoadingProps) {
  return (
    <View style={styles.activity}>
      <ActivityIndicator 
        size={size} 
        color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  activity: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
})
