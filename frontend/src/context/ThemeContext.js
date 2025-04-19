/**
 * Theme context for managing application-wide theme state
 * Provides theme state and toggle functionality to all components
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import userService from '../services/userService';

// Create the context
const ThemeContext = createContext();

/**
 * Theme provider component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  // Initialize theme based on user preference or localStorage
  useEffect(() => {
    const initializeTheme = async () => {
      // First check localStorage for theme preference
      const savedMode = localStorage.getItem('darkMode');
      
      if (savedMode !== null) {
        // Apply stored preference
        const isDark = savedMode === 'true';
        setDarkMode(isDark);
        applyThemeToBody(isDark);
      } else if (isAuthenticated && user?.themePreference) {
        // If authenticated user has a preference, use that
        const isDark = user.themePreference === 'dark';
        setDarkMode(isDark);
        applyThemeToBody(isDark);
        localStorage.setItem('darkMode', isDark.toString());
      } else {
        // Default to light mode
        setDarkMode(false);
        applyThemeToBody(false);
      }
      
      setLoading(false);
    };
    
    initializeTheme();
  }, [isAuthenticated, user]);
  
  /**
   * Apply theme to body element
   * @param {boolean} isDark - Whether to apply dark mode
   */
  const applyThemeToBody = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  /**
   * Toggle between light and dark mode
   */
  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Update localStorage
    localStorage.setItem('darkMode', newMode.toString());
    
    // Apply theme to body
    applyThemeToBody(newMode);
    
    // If user is authenticated, save preference to profile
    if (isAuthenticated) {
      try {
        await userService.updateProfile({
          themePreference: newMode ? 'dark' : 'light'
        });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };
  
  // Context value to be provided
  const contextValue = {
    darkMode,
    toggleTheme,
    loading
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 