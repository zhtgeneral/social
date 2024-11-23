import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import { Image } from 'expo-image'
import { getUserImageSource } from '@/services/imageServices'


interface AvatarProps {
  uri: string | null,
  size?: number,
  rounded?: number,
  style?: any
}

/**
 * This component renders an avatar.
 */
const Avatar: FC<AvatarProps> = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {}
}) => {
  return (
    <Image 
      source={getUserImageSource(uri)}  
      transition={100}
      style={[styles.avatar, style, { height: size, width: size, borderRadius: rounded }]}
    />
  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1
  }
})