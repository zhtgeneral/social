import React from 'react';
import Svg, { Circle, SvgProps } from "react-native-svg"

/**
 * This component renders a custom three dots icon.
 * @requires index.tsx sets `height` `width`, `stroke`, `strokeWidth`
 */
const ThreeDotsHorizontal: React.FC<SvgProps> = ({
  ...props
}) => {
  return (
    <Svg  
      fill="none"
      viewBox="0 0 24 24"
      {...props}
      >
      <Circle 
        cx="4" 
        cy="12" 
        r="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        />
      <Circle 
        cx="12" 
        cy="12" 
        r="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        />
      <Circle 
        cx="20" 
        cy="12" 
        r="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        />
    </Svg>
  );
}
export default ThreeDotsHorizontal;
