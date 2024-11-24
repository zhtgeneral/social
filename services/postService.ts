import { supabase } from "@/lib/Supabase";
import { uploadFile } from "./imageService";
import { Response } from "./index";
import { ImagePickerAsset } from "expo-image-picker";

export interface UpsertPostData {
  file: ImagePickerAsset | null,
  body: string,
  userId: string
}

export async function createOrUpdatePost(post: UpsertPostData): Promise<Response> {
  let { file, body, userId } = post;
  try {
    if (file && typeof post === 'object') {
      const isImage = file.type === 'image';
      const folderName = isImage? 'postImages': 'postVideos';
      const fileResult = await uploadFile(folderName, file.uri, isImage);
      if (fileResult.success) {
        file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .upsert({
        file: file,
        body: body,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.log("createOrUpdatePost: upsert error: ", error.message);
      return {
        success: false,
        message: error.message
      }
    }
    return {
      success: true,
      data: data
    }
  } catch (error: any) {
    console.log("createOrUpdatePost: upsert error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}