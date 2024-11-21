import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg"

interface UserProps extends SvgProps {
  strokeWidth?: number,
  stroke?: string
}

const User: React.FC<UserProps> = ({
  strokeWidth = 1.5,
  stroke = "black", 
  ...props
}) => {
  return (
    <Svg  
      fill="none"
      viewBox="0 0 24 24"
      width={30}
      height={30}
      strokeWidth={strokeWidth}
      stroke={stroke} 
      {...props}
    >
      <Path 
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
      <Path 
        d="M14.75 9.5C14.75 11.0188 13.5188 12.25 12 12.25C10.4812 12.25 9.25 11.0188 9.25 9.5C9.25 7.98122 10.4812 6.75 12 6.75C13.5188 6.75 14.75 7.98122 14.75 9.5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
      <Path 
        d="M5.49994 19.0001L6.06034 18.0194C6.95055 16.4616 8.60727 15.5001 10.4016 15.5001H13.5983C15.3926 15.5001 17.0493 16.4616 17.9395 18.0194L18.4999 19.0001"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default User;
