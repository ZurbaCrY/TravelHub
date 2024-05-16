import { AppState } from "react-native";
import { supabase as sb } from "./supabase";
class AuthService {
  constructor(supabase) {
    this.supabase = supabase
    this.user = null

    AppState.addEventListener("change", (this.handleAppStateChange))
  }

  handleAppStateChange = (state) => {
    if (state === "active") {
      this.supabase.auth.startAutoRefresh();
    } else {
      this.supabase.auth.stopAutoRefresh();
    }
  }

  setUser(user) {
    this.user = user
  }

  async signUp(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw Error('Passwords do not match')
    }
    try {
      // Check if Username is unique
      let { data: usernameData, error: usernameError } = await this.supabase
        .from("users")
        .select("user_id")
        .eq("username", username);
      if (usernameData && usernameData.length > 0) {
        throw new Error("Username is already taken");
      }

      // Check if email is unique
      let { data: emailData, error: emailError } = await this.supabase
        .from("users")
        .select("user_id")
        .eq("email", email);
      if (emailData && emailData.length > 0) {
        throw new Error("Email is already taken");
      }

      // Sign up the user
      const { user, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      user = null;
      if(user != null) {
        console.log(user)
  
        // Update User information in db
        await this.supabase
          .from('users')
          .insert([{if: user.id, email, username}]);
  
        // Set the user in AuthService
        this.setUser(user);
        return true
      } else {
        throw new Error("Something went wrong: auth.js:65");
      }
    } catch (error) {
      throw error;
    }
  }

  // async signIn(username, email, password) {
  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      // data has session and user (and weak password) information, only user is needed here
      this.setUser(data.user)
      return true;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw error;
      }
      this.setUser(null)
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(sb);