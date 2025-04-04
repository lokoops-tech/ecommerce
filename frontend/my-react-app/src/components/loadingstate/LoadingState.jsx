import './LoadingState.css';
import React, { createContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (replace with your actual loading logic)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {!isLoading && children}
    </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
