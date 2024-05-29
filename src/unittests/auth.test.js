import AuthService from '../User-Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

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

jest.mock('./supabase', () => ({
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

  it('should throw error if username or email is not unique during sign up', async () => {
    authService.supabase.from.mockReturnThis();
    authService.supabase.select.mockReturnThis();
    authService.supabase.eq.mockResolvedValueOnce({ data: [{ user_id: '123' }] });

    await expect(authService.signUp('username', 'test@example.com', 'password', 'password')).rejects.toThrow('username is already taken');
  });
});
