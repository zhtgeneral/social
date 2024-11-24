import { supabase } from "@/lib/Supabase";
import { User } from "@/types/supabase";
import { Response } from "./index";

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
    console.log("getUserData error: " + error);
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * This function updates the user data into Supabase.
 */
export async function updateUser(userId: string, data: User): Promise<Response> {
  try {
    const { error } = await supabase
    .from("users")
    .update(data)
    .eq('id', userId);

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
    console.log("updateUser error: " + error);
    return {
      success: false,
      message: error.message
    }
  }
}