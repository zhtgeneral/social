import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { Router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

interface BackButtonProps {
  size?: number
  router: Router
}

/**
 * This component renders a custom back button.
 * 
 * It takes the user to the previous page when pressed.
 */
export default function BackButton({
  size = 26,
  router
}: BackButtonProps){
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon 
        name="arrowLeft" 
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}/>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.lightGray
  }
})

