import React from 'react';
import Svg, { Circle, Path, SvgProps } from "react-native-svg"

/**
 * This component renders a custom LeftArrow icon.
 * @requires index.tsx sets `heightWidth`, `stroke`, `strokeWidth`, `color`
 */
const ArrowLeft: React.FC<SvgProps> = ({
  ...props
}) => {
  return (
    <Svg  
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <Circle 
        cx="12" 
        cy="12" 
        r="10" 
        {...props}
      />
      <Path 
        d="M13.5 16C13.5 16 10.5 13.054 10.5 12C10.5 10.9459 13.5 8 13.5 8"
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default ArrowLeft;
