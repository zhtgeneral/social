import { supabase } from "@/lib/Supabase";
import { uploadFile } from "./imageService";
import { CustomResponse } from "./index";
import { ImagePickerAsset } from "expo-image-picker";
import { PostLike } from "@/types/supabase";

export interface UpsertPostData {
  file: ImagePickerAsset | null,
  body: string,
  userId: string
}

/**
 * This function formats the data in a json format.
 */
export function formatPostData(
  file: ImagePickerAsset | null, 
  body: string, 
  userId: string
): UpsertPostData {
  return {
    file: file,
    body: body,
    userId: userId
  }
}

/**
 * This function upserts a post into Supabase.
 * 
 * If there is a database error, it returns the error message.
 * 
 * Otherwise it returns the upserted data.
 */
export async function createOrUpdatePost(post: UpsertPostData): Promise<CustomResponse> {
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


/**
 * This function upserts a post into Supabase.
 */
export async function fetchPosts(limit: number = 10): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *, 
        user: users (id, name, image),
        postLikes (*)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("getPost: get error: ", error.message);  
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
    console.log("getPost: get error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function inserts a postLike into Supabase.
 */
export async function createPostLike(postLike: PostLike): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('postLikes')
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("createPostLike: insert error: ", error.message);  
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
    console.log("createPostLike: insert error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function removes a postLike from Supabase.
 */
export async function removePostLike(userId: string, postId: string): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('postLikes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)

    if (error) {
      console.log("deletePostLike: delete error: ", error.message);  
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
    console.log("deletePostLike: delete error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}