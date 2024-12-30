import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

/**
 * This function gets the height as a percentage
 */
export function hp(percentage: number) {
  return (percentage * deviceHeight) / 100;
}
/**
 * This functiong ets the width as a pecentage
 */
export function wp(percentage: number) {
  return (percentage * deviceWidth) / 100;
}

export function stripHTMLTags(html: string): string {
  return html.replace(/<[^>]*>/gm, "");
}

export function getFileType(ending: string): "video" | "image" | undefined {
  switch (ending) {
    case "mp4": {
      return "video";
    }
    case "png":
    case "jpg": {
      return "image";
    }
    default: return undefined;
  }
}