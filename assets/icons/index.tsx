import React from 'react';
import { StyleSheet } from 'react-native';
import Home from './Home';
import { theme } from '@/constants/theme';

const icons = {
  home: Home,
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