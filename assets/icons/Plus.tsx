import React from 'react';
import Svg, { Path, SvgProps } from "react-native-svg"

/**
 * This component renders a custom plus icon.
 * @requires index.tsx sets `height` `width`, `stroke`, `strokeWidth`
 */
const Plus: React.FC<SvgProps> = ({
  ...props
}) => {
  return (
    <Svg  
      fill="none"
      viewBox="0 0 24 24"
      {...props}
      >
      <Path 
        d="M12 8V16M16 12L8 12"
        strokeLinejoin="round" 
        />
      <Path 
        d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
        strokeLinejoin="round" 
        />
    </Svg>
  );
}
export default Plus;
