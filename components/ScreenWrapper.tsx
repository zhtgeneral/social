import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children?: React.ReactNode,
  bg?: any
}

/**
 * This component adds padding from the top of the screen 
 * and sets the background color of the children.
 */
export default function ScreenWrapper ({
  children,
  bg
}: ScreenWrapperProps) {
  const { top } = useSafeAreaInsets();
  const paddingTop = (top > 0)? (top + 5): 30;
  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg}}>
      {children}
    </View>
  )
}