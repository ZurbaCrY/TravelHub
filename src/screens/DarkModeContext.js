// DarkModeContext.js
import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

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

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook für den Zugriff auf den Kontext
export const useDarkMode = () => useContext(DarkModeContext);
