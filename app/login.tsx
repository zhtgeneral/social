import Icon from '@/assets/icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import React from 'react';
import { Text } from 'react-native';


const Login: React.FC = () => {
  return (
    <ScreenWrapper>
      <Text>
        Login
      </Text>
      <Icon name="home" stroke={theme.colors.primary} />
    </ScreenWrapper>
  );
}

export default Login;