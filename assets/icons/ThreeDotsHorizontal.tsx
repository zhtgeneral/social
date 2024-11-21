import React from 'react';
import Svg, { Rect, SvgProps } from "react-native-svg"

/**
 * This component renders a custom three dots icon.
 * @requires index.tsx sets `height` `width`, `stroke`, `strokeWidth`
 */
const ThreeDotsHorizontal: React.FC<SvgProps> = ({
  ...props
}) => {
  const widthValue = Number(props.width?.toString());
  const right = widthValue * 0.75;
  const middle = widthValue * 0.4375;
  const left = widthValue * 0.125;
  const thickness = widthValue * 0.15;
  const radius = widthValue * 0.1;
  return (
    <Svg  
      fill="none"  
      {...props}
    >
      <Rect 
        x={right} 
        y={middle} 
        width={thickness} 
        height={thickness} 
        rx={radius}
        strokeLinejoin="round" 
      />
      <Rect 
        x={middle} 
        y={middle}
        width={thickness} 
        height={thickness} 
        rx={radius}
        strokeLinejoin="round" 
      />
      <Rect 
        x={left} 
        y={middle}
        width={thickness} 
        height={thickness} 
        rx={radius}
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default ThreeDotsHorizontal;
