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
      <Icon name="lock" stroke={theme.colors.primary} />
      <Icon name="mail" stroke={theme.colors.primary} />
      <Icon name="user" stroke={theme.colors.primary} />
      <Icon name="heart" stroke={theme.colors.primary} />
      <Icon name="plus" stroke={theme.colors.primary} />
      <Icon name="search" stroke={theme.colors.primary} />
      <Icon name="location" stroke={theme.colors.primary} />
      <Icon name="call" stroke={theme.colors.primary} />
      <Icon name="camera" stroke={theme.colors.primary} />
      <Icon name="edit" stroke={theme.colors.primary} />
      <Icon name="arrowLeft" stroke={theme.colors.primary} />
      <Icon name="threeDots" stroke={theme.colors.primary} />
    </ScreenWrapper>
  );
}

export default Login;
