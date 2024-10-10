import { supabase as sb } from "./supabase";
import AuthService from './auth';

class UserDataHandler {
  constructor(supabase) {
    this.user = null;
    this.supabase = supabase;
    this.userData = {
      user_id: "",
      username: "",
      email: "",
      profile_picture_url: "",
      status: "",
      last_seen: "",
      bio: "",
      phone: "",
      created_at: "",
      updated_at: "",
      birthday: "",
      home_country: "",
      first_name: "",
      last_name: "",
    }
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      await AuthService.initialize();
      this.user = await AuthService.getUser();
      if (!this.user || !this.user.id) {
        this.initialized = false;
        console.info("User not loaded");
        return;
      }
      await this.loadUserData();
    } catch (error) {
      console.error("Error in UserDataHandler setup: ", error);
    }
  }

  async loadUserData() {
    try {
      const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', this.user.id)

      if (error) {
        throw new Error("Error fetching user data: " + error.message);
      }
      if (data) {
        this.userData = data[0];
      } else {
        console.log("No user data found for the current user.");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  async getUserData() {
    try {
      await this.initialize();
      return this.userData;
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  }

  async updateUserData(newData) {
    this.userData = { ...this.userData, ...newData };
    await this.database.updateUserData(this.userData);
  }
}

export default new UserDataHandler(sb);