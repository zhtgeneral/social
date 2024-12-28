import Button from "@/components/Button"
import ScreenWrapper from "@/components/ScreenWrapper"
import { theme } from "@/constants/theme"
import { hp, wp } from "@/helpers/common"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { 
  Image, 
  Pressable, 
  StyleSheet, 
  Text, 
  View 
} from "react-native"

/**
 * This page handles `/welcome`.
 * 
 * It shows the welcome image and displays a button
 * for getting started.
 * 
 * When the get started button is pressed, it takes the user to `/signup`.
 */
export default function Welcome() {
  const router = useRouter();
  const welcomeImage = require('../assets/images/welcome.png');
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image 
          style={styles.welcomeImage} 
          source={welcomeImage}
          resizeMode="contain" />
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Unlinkedout</Text>
          <Text style={styles.punchline}>Punchline</Text>
          </View>
        <View style={styles.footer}>
          <Button 
            title='Get Started'
            buttonStyle={{ marginhorizontal: wp(3) }}
            onPress={() => router.push('/signup')} />
          <View style={styles.buttonTextContainer}>
            <Text style={[styles.loginText]}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={[styles.loginText, styles.loginButtonText]}>Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenWrapper>
  )
}

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
  footer: {
    gap: 30,
    width: '100%'
  },
  buttonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  },
  loginButtonText: { 
    color: theme.colors.primaryDark, 
    fontWeight: theme.fonts.semibold as 600
  }
})

