// DarkModeContext.js
import React, { createContext, useState, useContext } from 'react';

// Kontext erstellen
export const DarkModeContext = createContext();

// Provider-Komponente
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook für den Zugriff auf den Kontext
export const useDarkMode = () => useContext(DarkModeContext);
