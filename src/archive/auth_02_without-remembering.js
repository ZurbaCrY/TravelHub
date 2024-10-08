import { supabase as sb } from "./supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';


class AuthService {
  constructor(supabase) {
    this.supabase = supabase
    this.user = null;
    this.loadUser();

    // AppState.addEventListener("change", (this.handleAppStateChange))
  }

  // handleAppStateChange = (state) => {
  //   if (state === "active") {
  //     this.supabase.auth.startAutoRefresh();
  //     this.update();
  //   } else {
  //     this.supabase.auth.stopAutoRefresh();
  //   }
  // }

  async loadUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        this.user = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Failed to load user from AsyncStorage:', error);
    }
  }

  async saveUser(user) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      this.user = user;
    } catch (error) {
      console.error('Failed to save user to AsyncStorage:', error);
    }
  }

  async removeUser() {
    try {
      await AsyncStorage.removeItem('user');
      this.user = null;
    } catch (error) {
      console.error('Failed to remove user from AsyncStorage:', error);
    }
  }

  getUser() {
    return this.user;
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.info("User signed in:", data.user)
      console.info("User.id:", data.user.id)
      await this.saveUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      console.info("User signed out")
      await this.removeUser();
      return this.user;
    } catch (error) {
      throw error;
    };
  }

  async signUp(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw Error('Passwords do not match')
    }
    try {
      // async func to check if a specific Value is in users table 
      // will not check for Auth Users
      const checkUnique = async (field, value) => {
        let { data, error } = await this.supabase
          .from("users")
          .select("user_id")
          .eq(field, value);
        if (error) throw error;
        if (data && data.length > 0) {
          throw new Error(`${field.capitalize()} is already taken`)
        }
      };
      await checkUnique("username", username);
      await checkUnique("email", email);
      // The main signUp:
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // Check if Data is there before proceeding
      if (data != null && data.user != null) {
        // Update User info table:
        await this.supabase
          .from('users')
          .insert([{
            user_id: data.user.id, 
            email: email, 
            username: username
          }]);
        await this.saveUser(data.user);
        return data.user;
      } else {
        // this line should theoretically never be executed as there should be a suapabase error if there is no user data
        throw new Error("Something went wrong, data retrieved: ", data);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(sb);