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
    this.initialize();
  }

  async initialize() {
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
        throw new Error("LoadUserData: Error fetching user data: " + error.message);
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

  removeUserData() {
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
  }

  async updateUserData(newData) {
    try {
      await this.initialize();

      if (!newData) {
        console.error("No data to update");
        return;
      }
      let countryId = null;
      if (newData.country && newData.country.home_country) {
        console.log("Fetching country ID for:", newData.country.home_country);
        const { data, error: countryError } = await this.supabase
          .from('Country')
          .select('Country_ID')
          .eq('Countryname', newData.country.home_country)
          .single();
        if (countryError) {
          throw new Error("Error fetching country ID: " + countryError.message);
        }
        countryId = data ? data.Country_ID : null;
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
        home_country: countryId ? countryId : this.userData.country.Country_ID,
      };

      const { data, error } = await this.supabase
        .from('users')
        .upsert(updateData)
        .eq('user_id', this.user.id)
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
          `);

      console.log("User data updated successfully:", data);

      if (error) {
        throw new Error("Error updating user data: " + error.message);
      }
      console.log("User data updated successfully:", data);

    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }
}

export default new UserDataHandler(sb);