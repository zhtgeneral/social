import React from 'react';
import Svg, { Circle, Path, SvgProps } from "react-native-svg"

interface ArrowLeftProps extends SvgProps {
  strokeWidth?: number,
  stroke?: string
}

const ArrowLeft: React.FC<ArrowLeftProps> = ({
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
      <Circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path 
        d="M13.5 16C13.5 16 10.5 13.054 10.5 12C10.5 10.9459 13.5 8 13.5 8"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default ArrowLeft;
