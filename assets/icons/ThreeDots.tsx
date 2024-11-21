import React from 'react';
import Svg, { NumberProp, Rect, SvgProps } from "react-native-svg"

interface ThreeDotsProps extends SvgProps {
  strokeWidth?: number,
  stroke?: string
  width?: NumberProp;
  height?: NumberProp
}

const ThreeDots: React.FC<ThreeDotsProps> = ({
  strokeWidth = 1.5,
  stroke = "black", 
  width = 24,
  height = 24,
  ...props
}) => {
  const widthValue = Number(width.toString());
  const right = widthValue * 0.75;
  const middle = widthValue * 0.4375;
  const left = widthValue * 0.125;
  return (
    <Svg  
      fill="none"
      // viewBox="0 0 24 24"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      stroke={stroke} 
      {...props}
    >
      <Rect 
        x={right} 
        y={middle} 
        width="3" 
        height="3" 
        rx="1"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
      <Rect 
        x={middle} 
        y={middle}
        width="3" 
        height="3" 
        rx="1"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
      <Rect 
        x={left} 
        y={middle}
        width="3" 
        height="3" 
        rx="1"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default ThreeDots;
