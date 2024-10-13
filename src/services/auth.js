import { supabase as sb } from "./supabase";
import * as SecureStore from "expo-secure-store";

class AuthService {
  constructor(supabase) {
    this.supabase = supabase;
    this.initialized = false;
    this.user = null;
    this.rememberMe = false;
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      await this.loadUser();
    } catch (error) {
      console.error("Error in AuthService setup: ", error);
    }
  }

  async getUser() {
    await this.initialize();
    return this.user;
  }

  async loadUser() {
    try {
      const userJson = await SecureStore.getItemAsync("user");
      if (userJson) {
        this.user = JSON.parse(userJson);
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }

  async saveUser(user) {
    try {
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to SecureStore:", error);
    }
  }

  async removeUser() {
    try {
      await SecureStore.deleteItemAsync("user");
      this.user = null;
    } catch (error) {
      console.error("Failed to remove user from AsyncStorage/SecureStore: ", error);
    }
  }

  async signIn(email, password, rememberMe) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    console.info("User signed in:", data.user);
    console.info("User.id:", data.user.id);
    this.rememberMe = rememberMe;
    if (this.rememberMe) {
      await this.saveUser(data.user);
    } else if (!this.rememberMe) {
      await this.removeUser();
    }
    this.user = data.user;
    return data.user;
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      await this.removeUser();
      this.user = null;
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  async signUp(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw Error("Passwords do not match");
    }
    // check if username and email are unique
    const checkUnique = async (field, value) => {
      let { data, error } = await this.supabase
        .from("users")
        .select("user_id")
        .eq(field, value);
      if (error) throw error;
      if (data && data.length > 0) {
        throw new Error(`${field.capitalize()} is already taken`);
      }
    };
    await checkUnique("username", username);
    await checkUnique("email", email);

    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });
    if (error) throw error;

    if (data != null && data.user != null) {
      await this.supabase.from("users").insert([
        {
          user_id: data.user.id,
          email: email,
          username: username,
        },
      ]);
      this.removeUser();
      this.user = data.user;
      return data.user;
    } else {
      throw new Error("Something went wrong, data retrieved: ", data);
    }
  }
}

export default new AuthService(sb);
