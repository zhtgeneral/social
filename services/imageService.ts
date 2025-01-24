import { supabase } from "@/lib/Supabase";
import { supabaseUrl } from "@/lib/Supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { CustomResponse } from "./index";

/**
 * This function gets the file URI in the form `{supabaseUrl}/storage/v1/object/public/{filePath}`
 */
export function getSupabaseFileUrl(filePath: string): string {
  if (filePath) {
    return `${supabaseUrl}/storage/v1/object/public/${filePath}`;
  }
  return "";
}

/**
 * This function gets the source of the image using Supabase.
 * 
 * If there is no image, return the uri for the default avatar.
 */
export function getUserImageSource(imagePath: string | null) {
  if (imagePath) {
    return { uri: getSupabaseFileUrl(imagePath) };
  } else {
    return require("../assets/images/defaultUser.png")
  }
}


/**
 * This function updates the user data to Supabase under
 * `/uploads/{folderName}/supabaseRandomID`.
 * 
 * If the upload fails, it returns the error message.
 * Otherwise it returns the full path to the file in Supabase.
 */
export async function uploadFile(
  folderName: string, 
  fileURI: string, 
  isImage: boolean = true
): Promise<CustomResponse> {
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

/**
 * This function downloads the file into the url.
 */
export async function downloadFile(url: string): Promise<string | undefined> {
  try {
    const { uri }  = await FileSystem.downloadAsync(url, getLocalFilePath(url))
    return uri;
  } catch (error: any) {
    return undefined;
  }
}

/**
 * This function gets the local pathname of a file's path by searching in documents.
 */
function getLocalFilePath(filePath: string) {
  const fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
}