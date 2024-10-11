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
          id:Country_ID,
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
    try {
      await this.initialize();
      
      const { data: countryId, error: countryError } = await this.supabase
        .from('Country')
        .select('Country_ID')
        .eq('Countryname', newData.country.home_country)
        .single();
      if (countryError) {
        throw new Error("Error fetching country ID: " + countryError.message);
      }

      this.userData = { ...this.userData, ...newData };

      const updateData = {
        first_name: newData.first_name ? newData.first_name : this.userData.first_name,
        last_name: newData.last_name ? newData.last_name : this.userData.last_name,
        username: newData.username ? newData.username : this.userData.username,
        email: newData.email ? newData.email : this.userData.email,
        profilepicture_url: newData.profilepicture_url ? newData.profilepicture_url : this.userData.profilepicture_url,
        birthdate: newData.birthdate ? newData.birthdate : this.userData.birthdate,
        bio: newData.bio ? newData.bio : this.userData.bio,
        home_country: countryId ? countryId.Country_ID : this.userData.country.Country_ID,
      };

      
      console.log("updateData:", updateData);

      // const { data, error } = await this.supabase
      //   .from('users')
      //   .upsert(this.userData)
      //  .eq('user_id', this.user.id)
      //   .select();
            
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }
}

export default new UserDataHandler(sb);