import React, { createContext, useState, useContext } from 'react';

// Create the LoadingContext
const LoadingContext = createContext();

// Create a provider for the loading state and message
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const showLoading = (message = null) => {
    setLoading(true);
    setLoadingMessage(message);
  };

  const hideLoading = () => {
    setLoading(false);
    setLoadingMessage("Loading...");
  };

  return (
    <LoadingContext.Provider value={{ loading, loadingMessage, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);
