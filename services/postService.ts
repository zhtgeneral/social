import { supabase } from "@/lib/Supabase";
import { uploadFile } from "./imageService";
import { CustomResponse } from "./index";
import { ImagePickerAsset } from "expo-image-picker";
import { Comment, PostLike } from "@/types/supabase";

export type UpsertPostData = {
  file: ImagePickerAsset | null | undefined,
  body: string,
  user_id: string
  id?: string
}

/**
 * This function upserts a post into Supabase.
 * 
 * If there is a database error, it returns the error message.
 * 
 * Otherwise it returns the upserted data.
 */
export async function createOrUpdatePost(post: UpsertPostData): Promise<CustomResponse> {
  let { file } = post;
  try {
    if (file && typeof post === 'object') {
      const isImage = file.type === 'image';
      const folderName = isImage? 'postImages': 'postVideos';
      const fileResult = await uploadFile(folderName, file.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .upsert(post)
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
 * This function removes a post from Supabase.
 */
export async function removePost(postId: string): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.log("removePost: delete error: ", error.message);  
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
    console.log("removePost: delete error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

export async function fetchPostsForUser(limit: number = 10, userId: string): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *, 
        user: users (id, name, image),
        postLikes (*),
        comments (count)
      `)
      .eq('user_id', userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetchPostsForUser: get error: ", error.message);  
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
    console.log("fetchPostsForUser: get error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function fetches all posts from Supabase with the user, postLikes, and comments count.
 * 
 * @purpose use this when fetching posts in main page.
 */
export async function fetchPostsAll(limit: number = 10): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *, 
        user: users (id, name, image),
        postLikes (*),
        comments (count)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetchPostsAll: get error: ", error.message);  
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
    console.log("fetchPostsAll: get error: ", error.message);
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
      console.log("removeComment: delete error: ", error.message);  
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
    console.log("removeComment: delete error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function gets post details from Supabase including user, postLikes, and comments array.
 * 
 * @purpose use this when fetching comments of a post.
 */
export async function fetchPostDetails(postId: string): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *, 
        user: users (id, name, image),
        postLikes (*),
        comments (*, user: users(id, name, image))
      `)
      .eq('id', postId)
      .order("created_at", { ascending: false, referencedTable: 'comments'})
      .single();

    if (error) {
      console.log("fetchPostDetails: get error: ", error.message);  
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
    console.log("fetchPostDetails: get error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function inserts a comment into Supabase.
 */
export async function createComment(comment: Comment): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("createComment: insert error: ", error.message);  
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
    console.log("createComment: insert error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function removes a comment from Supabase.
 */
export async function removeComment(commentId: string): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.log("removeComment: delete error: ", error.message);  
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
    console.log("removeComment: delete error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}