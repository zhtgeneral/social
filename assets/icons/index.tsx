import React from 'react';
import { StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { theme } from '@/constants/theme';
import Home from './Home';
import Mail from './Mail';
import Lock from './Lock';
import Heart from './Heart';
import Plus from './Plus';
import Search from './Search';
import Location from './Location';
import Call from './Call';
import Camera from './Camera';
import Edit from './Edit';
import ArrowLeft from './ArrowLeft';
import ThreeDotsHorizontal from './ThreeDotsHorizontal';
import User from './User';
import ThreeDotsCircle from './ThreeDotsCircle';
import Comment from './Comment';
import Share from './Share';
import Send from './Send';
import Delete from './Delete';
import Logout from './Logout';
import Image from './Image';
import Video from './Video';
import Phone from './Phone';

const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsHorizontal: ThreeDotsHorizontal,
  threeDotsCircle: ThreeDotsCircle,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,
  phone: Phone
}

interface IconProps extends SvgProps {
  name: keyof typeof icons,
  size?: number,
  strokeWidth?: number,
  stroke?: string
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  strokeWidth = 1.9,
  stroke = theme.colors.textLight,
  ...props
}) => {
  const IconComponent = icons[name];
  return (
    <IconComponent 
      height={size}
      width={size}
      strokeWidth={strokeWidth}
      stroke={stroke}
      {...props}
    />
  )
}

export default Icon;

const styles = StyleSheet.create({

})