import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLoading } from './LoadingContext';
import AuthService from '../services/auth'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState(null);

  // Initialize user on component mount
  useEffect(() => {
    const initUser = async () => {
      showLoading('Initializing user...');
      try {
        await AuthService.initialize();
        const fetchedUser = await AuthService.getUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        hideLoading();
      }
    };
    initUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);