import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * This component renders a custom footer.
 * 
 * It shows a button for getting started.
 * 
 * It shows text to allow the user to login rather than create account.
 */
const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <Button 
        title='Getting Started'
        buttonStyle={{ marginhorizontal: wp(3) }}
        onPress={() => router.push('./signup')}
      />
      <View style={styles.buttonTextContainer}>
        <Text style={[styles.loginText]}>
          Already have an account?
        </Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={[styles.loginText, styles.loginButtonText]}>
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Footer;

const styles = StyleSheet.create({
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

