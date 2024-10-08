import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLoading } from './LoadingContext';
import AuthService from '../services/auth'
import { supabase } from '../services/supabase';

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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
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