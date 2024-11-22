import { supabase } from "@/lib/Supabase";

export interface Response {
  success: boolean,
  message?: string
  data?: any
}

/**
 * This function gets the user data from Supabase.
 * 
 * @usecase use thie because `user` from Supabase auth has little info
 */
export async function getUserData(userId: string): Promise<Response> {
  try {
    const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .maybeSingle();

    if (error) {
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
    console.log("error: " + error);
    return {
      success: false,
      message: error.message
    }
  }
}