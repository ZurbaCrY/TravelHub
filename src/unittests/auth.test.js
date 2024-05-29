import { supabase as sb } from "../User-Auth/supabase";
import * as SecureStore from 'expo-secure-store';

class AuthService {
  constructor(supabase) {
    this.supabase = supabase
    this.user = null;
    this.loadUser();

  }

  async loadUser() {
    try {
      const userJson = await SecureStore.getItemAsync('user');
      if (userJson) {
        console.log("Found User: ", userJson)
        this.user = JSON.parse(userJson);
      } else {
        console.log("No User Signed in")
      }
    } catch (error) {
      console.error('Failed to load user from SecureStore:', error);
    }
  }

  async saveUser(user) {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to SecureStore:', error);
    }
  }

  async removeUser() {
    try {
      await SecureStore.deleteItemAsync('user');
      this.user = null;
    } catch (error) {
      console.error('Failed to remove user from AsyncStorage/SecureStore: ', error);
    }
  }

  getUser() {
    return this.user;
  }

  async signIn(email, password, rememberMe) {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.info("User signed in:", data.user)
      console.info("User.id:", data.user.id)
      // SaveUser Saves to SecureStore if User wants so
      if (rememberMe) {
        await this.saveUser(data.user)
      }
      this.user = data.user;
      return data.user;
  }

  async signOut() {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      console.info("User signed out")
      await this.removeUser();
      return this.user;
  }

  async signUp(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw Error('Passwords do not match')
    }
      // check if username and email are unique 
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
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          }
        }
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
        // Only local Save, user needs to login again on next app open
        this.user = data.user;
        return data.user;
      } else {
        throw new Error("Something went wrong, data retrieved: ", data);
      }
  }
}

export default new AuthService(sb);

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('../User-Auth/supabase', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn(),
}));

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService({
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load user from SecureStore', async () => {
    SecureStore.getItemAsync.mockResolvedValue(JSON.stringify({ id: '123' }));
    await authService.loadUser();
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('user');
    expect(authService.user).toEqual({ id: '123' });
  });

  it('should save user to SecureStore', async () => {
    const user = { id: '123' };
    await authService.saveUser(user);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user', JSON.stringify(user));
  });

  it('should remove user from SecureStore', async () => {
    await authService.removeUser();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user');
    expect(authService.user).toBeNull();
  });

  it('should sign in user and save to SecureStore if rememberMe is true', async () => {
    const user = { id: '123' };
    authService.supabase.auth.signInWithPassword.mockResolvedValue({ data: { user } });
    const result = await authService.signIn('test@example.com', 'password', true);
    expect(authService.supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user', JSON.stringify(user));
    expect(authService.user).toEqual(user);
    expect(result).toEqual(user);
  });

  it('should sign out user and remove from SecureStore', async () => {
    authService.supabase.auth.signOut.mockResolvedValue({});
    const result = await authService.signOut();
    expect(authService.supabase.auth.signOut).toHaveBeenCalled();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user');
    expect(authService.user).toBeNull();
    expect(result).toBeNull();
  });

  it('should sign up user and insert into database', async () => {
    const user = { id: '123' };
    authService.supabase.auth.signUp.mockResolvedValue({ data: { user } });
    authService.supabase.from.mockReturnThis();
    authService.supabase.select.mockReturnThis();
    authService.supabase.eq.mockResolvedValue({ data: [] });
    authService.supabase.insert.mockResolvedValue({});

    const result = await authService.signUp('username', 'test@example.com', 'password', 'password');
    expect(authService.supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: { data: { username: 'username' } },
    });
    expect(authService.supabase.from).toHaveBeenCalledWith('users');
    expect(authService.supabase.insert).toHaveBeenCalledWith([{ user_id: '123', email: 'test@example.com', username: 'username' }]);
    expect(authService.user).toEqual(user);
    expect(result).toEqual(user);
  });

  it('should throw error if passwords do not match during sign up', async () => {
    await expect(authService.signUp('username', 'test@example.com', 'password', 'wrongpassword')).rejects.toThrow('Passwords do not match');
  });
});