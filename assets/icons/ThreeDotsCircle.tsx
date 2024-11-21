import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg"

/**
 * This component renders a custom ThreeDotsCircle icon.
 * @requires index.tsx sets `height` `width`, `stroke`, `strokeWidth`
 */
const ThreeDotsCircle: React.FC<SvgProps> = ({
  ...props
}) => {
  return (
    <Svg  
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path 
        d="M11.9959 12H12.0049"
        strokeLinejoin="round" 
        strokeLinecap="round"
      />
      <Path 
        d="M15.9998 12H16.0088"
        strokeLinejoin="round" 
        strokeLinecap="round"
      />
      <Path 
        d="M7.99981 12H8.00879"
        strokeLinejoin="round"
        strokeLinecap="round" 
      />
      <Path 
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        strokeLinejoin="round"
        strokeLinecap="round" 
      />
    </Svg>
    
  );
}
export default ThreeDotsCircle;
