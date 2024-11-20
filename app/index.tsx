import { Text, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

/**
 * This component is the main page.
 * 
 * It shows a button that redirects the user to `/welcome` when clicked
 */
const Index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <Text>index page</Text>
      <Button 
        title="welcome" 
        onPress={() => router.push('./welcome')}
      >

      </Button>
    </ScreenWrapper>
  )
}
export default Index;