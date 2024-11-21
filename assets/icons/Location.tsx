import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg"

interface LocationProps extends SvgProps {
  strokeWidth?: number,
  stroke?: string
}

const Location: React.FC<LocationProps> = ({
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
        d="M18 18C19.2447 18.4244 20 18.9819 20 19.5925C20 20.9221 16.4183 22 12 22C7.58172 22 4 20.9221 4 19.5925C4 18.9819 4.75527 18.4244 6 18"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
      <Path 
         d="M15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5C13.6569 6.5 15 7.84315 15 9.5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
      <Path 
        d="M12 2C16.0588 2 19.5 5.42803 19.5 9.5869C19.5 13.812 16.0028 16.777 12.7725 18.7932C12.5371 18.9287 12.2709 19 12 19C11.7291 19 11.4629 18.9287 11.2275 18.7932C8.00325 16.7573 4.5 13.8266 4.5 9.5869C4.5 5.42803 7.9412 2 12 2Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default Location;
