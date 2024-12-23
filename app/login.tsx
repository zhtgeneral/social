import Icon from '@/assets/icons';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/Supabase';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  Alert,
  Pressable,
  StyleSheet, 
  Text, 
  View 
} from 'react-native';

/**
 * This page handles `/login`.
 * 
 * It shows a login form with 2 inputs and a login button.
 * 
 * When the form is submitted, 
 * it alerts the user of unfilled fields or possible errors.
 * 
 * Otherwise it triggers an auth change.
 * Because supabase is listening to this event in `_layout.tsx`,
 * the user will be redirected to `/home`.
 * 
 * @requires supabase.auth needs to be listening to `onAuthStateChange`
 */
export default function Login() {
  const router = useRouter();

  const emailRef = React.useRef("");
  const passwordRef= React.useRef("");

  const [loading, setLoading] = React.useState(false);

  class LoginController {
    public static async onSubmit() {
      let email: string;
      let password: string;
      try {
        const { validatedEmail, validatedPassword } = LoginController.validateForm();
        email = validatedEmail;
        password = validatedPassword;
      } catch (error: any) {
        Alert.alert('Login error', "Please fill in all fields");
        return;
      }
  
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        Alert.alert("Login error", error.message);
      }
      setLoading(false);
    }
  
    private static validateForm() {
      const email = emailRef.current.trim();
      const password = passwordRef.current;
  
      if (!email || !password) {
        throw new Error();
      }
      return { 
        validatedEmail: email, 
        validatedPassword: password
      }
    }

  }
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark"/>
      <View style={styles.container}>
        <BackButton router={router} />
        {/* Header */}
        <View>
          <Text style={styles.welcomeText}>
            Hey,
          </Text>
          <Text style={styles.welcomeText}>
            Welcome back
          </Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue
          </Text>
          <Input 
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder='Enter your email'
            onChangeText={(value: string) => { emailRef.current = value }}
          />
          <Input 
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={(value: string) => { passwordRef.current = value }}
          />
          <Text style={styles.forgotPassword}>
            {/* TODO */}
            Forgot password?
          </Text>
          <Button title="Login" loading={loading} onPress={LoginController.onSubmit}/>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={[styles.footerText, styles.footerLink]}>
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5)
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold as 700,
    color: theme.colors.text
  },
  form: {
    gap: 25
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold as 600,
    color: theme.colors.text
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  },
  footerLink: {
    color: theme.colors.primaryDark, 
    fontWeight: theme.fonts.semibold as 600
  }
})

