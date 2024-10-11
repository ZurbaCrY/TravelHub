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
      profilepicture_url: "",
      bio: "",
      birthdate: "",
      country: {},
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
      .select(`
        user_id,
        first_name,
        last_name,
        username,
        email,
        profilepicture_url,
        birthdate,
        bio,
        country:Country( 
          home_country:Countryname,
          home_country_code:ISO_Name
          )
          `)
          .eq('user_id', this.user.id)
      
          if (error) {
        throw new Error("Error fetching user data: " + error.message);
      }
      if (data) {
        this.userData = { ...this.userData, ...data[0] };
    
        console.log("User data loaded successfully:", this.userData);
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