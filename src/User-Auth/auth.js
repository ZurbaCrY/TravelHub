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

  // async update() {
  //   try {
  //     console.log("awaiting")
  //     const { data, error } = await this.supabase.auth.getSession()
  //     this.session = data.session
  //     this.user = data.session.user
  //     // debug:
  //     if(this.session.user == this.user){
  //       console.log("hussa")
  //     }
  //   } catch (error) {
  //     throw error;
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
      await this.removeUser();
      console.log(this.user)
    } catch (error) {
      throw error;
    };
  }



  // This function needs some serious debugging
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
      user = data.user
      console.log(data)
      console.log(user)
      if (data != null) {
        console.log("New User:", user)

        // Update User information in db
        await this.supabase
          .from('users')
          .insert([{ if: user.id, email, username }]);

        // Set the user in AuthService
        this.user = user;
        this.session = data.session;
        return true
      } else {
        throw new Error("Something went wrong: auth.js:59");
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(sb);