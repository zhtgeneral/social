import { View, Text, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

const Index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <Text>index page</Text>
      <Button title="welcome" onPress={() => router.push('./welcome')}>

      </Button>
    </ScreenWrapper>
  )
}
export default Index;