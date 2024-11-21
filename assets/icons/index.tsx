import React from 'react';
import { StyleSheet } from 'react-native';
import Home from './Home';
import { theme } from '@/constants/theme';
import Mail from './Mail';
import Lock from './Lock';
import User from './user';
import Heart from './Heart';

const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart
}

interface IconProps {
  name: keyof typeof icons,
  size?: number,
  strokeWidth?: number,
  stroke: string
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  strokeWidth = 1.9,
  ...props
}) => {
  const IconComponent = icons[name];
  return (
    <IconComponent 
      height={size}
      width={size}
      strokeWidth={strokeWidth}
      color={theme.colors.textLight}
      {...props}
    />
  )
}

export default Icon;

const styles = StyleSheet.create({

})