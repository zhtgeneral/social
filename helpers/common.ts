import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export function hp(percentage: number) {
  return (percentage * deviceHeight) / 100;
}
export function wp(percentage: number) {
  return (percentage * deviceWidth) / 100;
}