import React from "react";
import { supabase } from "./supabase";

export default async function getUserById(user_id) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if(error) throw error;

    if(data) {
      return data;
    }    
  } catch (error) {
    console.error("Error getting user by id: ", error)
    return null
  }
}