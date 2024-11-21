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
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';


const Login: React.FC = () => {
  const router = useRouter();

  const emailRef = useRef("");
  const passwordRef= useRef("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    const email = emailRef.current.trim();
    const password = passwordRef.current;

    if (!email || !password) {
      Alert.alert('Login error', "Please fill in all fields");
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      Alert.alert("Login error", error.message);
    }
    console.log('data: ', JSON.stringify(data.user, null, 2));
    setLoading(false);
  }
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark"/>
      <View style={styles.container}>
        <BackButton router={router} />
        <View>
          <Text style={styles.welcomeText}>
            Hey,
          </Text>
          <Text style={styles.welcomeText}>
            Welcome back
          </Text>
        </View>

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
              Forgot password?
            </Text>
            <Button 
              title="Login" 
              loading={loading} 
              onPress={onSubmit}
            />
          </View>

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

export default Login;

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

