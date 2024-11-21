import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg"

interface SearchProps extends SvgProps {
  strokeWidth?: number,
  stroke?: string
}

const Search: React.FC<SearchProps> = ({
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
        d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
        stroke={stroke}
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
      />
      <Path 
        d="M15 15L17 17M16 11.5C16 9.01469 13.9853 7 11.5 7C9.01469 7 7 9.01469 7 11.5C7 13.9853 9.01469 16 11.5 16C13.9853 16 16 13.9853 16 11.5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round" 
      />
    </Svg>
  );
}
export default Search;
