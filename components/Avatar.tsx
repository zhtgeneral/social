import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import { getUserImageSource } from '@/services/imageService'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'


interface AvatarProps {
  uri: string | null,
  size?: number,
  rounded?: number,
  style?: any
}

/**
 * This component renders an avatar.
 * 
 * It takes in uri which is a string in the format of `/uploads/<location>/id.ext` or `""`
 * where the first format is the shortened Supabase storage path.
 */
export default function Avatar({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {}
}: AvatarProps) {
  return (
    <Image 
      source={getUserImageSource(uri)}  
      transition={100}
      style={[styles.avatar, style, { height: size, width: size, borderRadius: rounded }]}
    />
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1
  }
})