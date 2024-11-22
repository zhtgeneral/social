import ScreenWrapper from "@/components/ScreenWrapper"
import React from "react"
import { View, Image, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import { hp, wp } from "@/helpers/common"
import { StyleSheet } from 'react-native'
import { theme } from "@/constants/theme"
import Footer from "./components/welcome/Footer"

/**
 * This page handles `/welcome`.
 * 
 * It shows the welcome image and displays a button
 * for getting started.
 * 
 * When the get started button is pressed, it takes the user to `/signup`.
 */
const Welcome = () => {
  const welcomeImage = require('../assets/images/welcome.png');
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image 
          style={styles.welcomeImage} 
          source={welcomeImage}
          resizeMode="contain"
        />
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>
            Link up
          </Text>
          <Text style={styles.punchline}>
            Punchline
          </Text>
        </View>
        <Footer />
      </View>
    </ScreenWrapper>
  )
}
export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginHorizontal: wp(10)
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center'
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold as 800
  },
  punchline: {  
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text
  },
})

