import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { useRouter } from 'expo-router'
import BackButton from './BackButton'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

interface HeaderProps {
  title?: string,
  showBackButton?: boolean,
  mb?: number
}

const Header: FC<HeaderProps> = ({
  title = "",
  showBackButton = false,
  mb = 10
}) => {
  const router = useRouter();
  return (
    <View style={[styles.container, { marginBottom: mb }]} >
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10
  },
  backButton: {
    position: 'absolute',
    left: 0
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold as 600,
    color: theme.colors.textDark
  }
})