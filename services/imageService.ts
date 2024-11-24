import { supabase, supabaseUrl } from "@/lib/Supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { Response } from "./index";

export function getSupabaseFileUrl(filePath: string) {
  if (filePath) {
    return { uri: `${supabaseUrl}/storage/v1/object/public/${filePath}`};
  }
  return null;
}

/**
 * This function gets the source of the image.
 * 
 * If there is no image, return the uri for the default avatar.
 */
export function getUserImageSource(imagePath: string | null) {
  if (imagePath) {
    return { uri: imagePath };
  } else {
    return require("../assets/images/defaultUser.png")
  }
}


/**
 * This function updates the user data to Supabase.
 */
export async function uploadFile(
  folderName: string, 
  fileURI: string, 
  isImage: boolean = true
): Promise<Response> {
  try {
    const fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileURI, {
      encoding: FileSystem.EncodingType.Base64
    });
    const imageData: ArrayBuffer = decode(fileBase64);

    const { data, error } = await supabase
      .storage
      .from("uploads")
      .upload(fileName, imageData, {
        contentType: isImage? 'image/*': 'video/*',
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      return {
        success: false,
        message: error.message
      }
    } 
    console.log("data uploadFile: ", JSON.stringify(data, null, 2));
    return {
      success: true,
      data: data.fullPath
    }    
  } catch (error: any) {
    console.log("uploadFile error: " + error);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function gets the file path 
 * @example `/profiles/2038476.png`
 */
function getFilePath(folderName: string, isImage: boolean): string {
  return `/${folderName}/${(new Date).getTime()}${isImage? '.png' : '.mp4'}`
}