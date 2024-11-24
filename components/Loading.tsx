import { theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from 'react-native'

interface LoadingProps {
  size?: ActivityIndicatorProps["size"],
  color?: ActivityIndicatorProps["color"]
}

/**
 * This component renders a custom loading spinner animation.
 */
const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = theme.colors.primary
}) => {
  return (
    <View style={styles.activity}>
      <ActivityIndicator 
        size={size} 
        color={color}
      />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  activity: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
})
