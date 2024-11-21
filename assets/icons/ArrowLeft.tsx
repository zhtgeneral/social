import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg";

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
      <Path 
        d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default ArrowLeft;
