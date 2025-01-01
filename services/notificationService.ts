import { supabase } from "@/lib/Supabase";
import { CustomResponse } from ".";

/**
 * This function inserts a postLike into Supabase.
 */
export async function createNotification(notification: Notification): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("notification: insert error: ", error.message);  
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
    console.log("notification: insert error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}