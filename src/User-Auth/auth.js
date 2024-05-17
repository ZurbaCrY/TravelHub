import { AppState } from "react-native";
import { supabase as sb } from "./supabase";
class AuthService {
  constructor(supabase) {
    this.supabase = supabase
    this.user = null
    this.session = null

    AppState.addEventListener("change", (this.handleAppStateChange))
  }

  handleAppStateChange = (state) => {
    if (state === "active") {
      this.supabase.auth.startAutoRefresh();
    } else {
      this.supabase.auth.stopAutoRefresh();
    }
  }

  async signUp(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw Error('Passwords do not match')
    }
    try {
      const checkUnique = async (field, value) => {
        let { data, error } = await this.supabase
          .from("users")
          .select("user_id")
          .eq(field, value);
        if (data && data.length > 0) {
          throw new Error(`${field.capitalize()} is already taken`);
        }
      };
      
      await checkUnique("username", username);
      await checkUnique("email", email);
      

      // Debug this func when emails can be sent again
      // Sign up the user
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      console.log(data)
      user = data.user
      if(data != null) {
        console.log("New User:", user)
  
        // Update User information in db
        await this.supabase
          .from('users')
          .insert([{if: user.id, email, username}]);
  
        // Set the user in AuthService
        this.setUser(user);
        return true
      } else {
        throw new Error("Something went wrong: auth.js:59");
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
      this.user = data.user
      this.session = data.session
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
      this.user = null
      this.session = null
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(sb);