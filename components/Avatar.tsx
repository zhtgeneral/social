import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import { Image } from 'expo-image'


interface AvatarProps {
  uri: string,
  size?: number,
  rounded?: number,
  style?: any
}

const Avatar: FC<AvatarProps> = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {}
}) => {
  return (
    <Image 
      source={{ uri }}  
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