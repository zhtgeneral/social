/**
 * This function gets the source of the image.
 * 
 * If there is no image, return the uri for the default avatar.
 */
export function getUserImageSource(imagePath: string) {
  if (imagePath) {
    return { uri: imagePath };
  } else {
    return require("../assets/images/defaultUser.png")
  }
}