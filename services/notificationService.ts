import { supabase } from "@/lib/Supabase";
import { Notification } from "@/types/supabase";
import { CustomResponse } from ".";

/**
 * This function inserts a notification into Supabase.
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

export async function fetchNotificationsForUser(
  limit: number = 10, 
  userId: string
): Promise<CustomResponse> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *, 
        sender: sender_id (id, name, image)
      `)
      .eq('reciever_id', userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetchNotificationsForUser: get error: ", error.message);  
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
    console.log("fetchNotificationsForUser: get error: ", error.message);
    return {
      success: false,
      message: error.message
    }
  }
}