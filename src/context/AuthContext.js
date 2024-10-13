import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLoading } from './LoadingContext';
import AuthService from '../services/auth'
import { supabase } from '../services/supabase';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  // Initialize user on component mount
  useEffect(() => {
    const initUser = async () => {
      showLoading(t('LOADING_MESSAGE.USER'));
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      await AuthService.initialize();
      const user = await AuthService.getUser();
      if (user && user.id) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);