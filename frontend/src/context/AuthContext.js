/**
 * Authentication Context for global state management
 * Manages user authentication state throughout the application
 */
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const AuthContext = createContext();

/**
 * AuthProvider component
 * Provides authentication state to all child components
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component with state
 */
export const AuthProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check for existing authentication when component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      // Try to get token from localStorage first (for "remember me")
      let token = localStorage.getItem('authToken');
      
      // If not found, check sessionStorage (for session-only auth)
      if (!token) {
        token = sessionStorage.getItem('authToken');
      }
      
      // Check if user is marked as authenticated
      const isAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
      
      if (token || isAuth === 'true') {
        // TODO: For a real implementation, verify token with backend
        // For now, just set as authenticated based on token existence
        setIsAuthenticated(true);
        
        // Get user data or set placeholder
        setUser({
          firstName: 'User',
          email: 'user@example.com'
        });
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  /**
   * Login user
   * @param {Object} userData - User credentials
   * @param {boolean} rememberMe - Whether to persist authentication
   * @returns {Promise<void>}
   */
  const login = async (userData, rememberMe) => {
    setLoading(true);
    
    try {
      // TODO: Implement actual API login call
      // const response = await axios.post('/api/auth/login', userData);
      // const { token, user } = response.data;
      
      // Placeholder for token and user data
      const token = 'fake-auth-token';
      const userData = {
        firstName: 'User',
        email: userData.email
      };
      
      // Store authentication state based on "remember me" preference
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('isAuthenticated', 'true');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register new user
   * @param {Object} userData - New user data
   * @returns {Promise<void>}
   */
  const register = async (userData) => {
    setLoading(true);
    
    try {
      // TODO: Implement actual API registration call
      // const response = await axios.post('/api/auth/register', userData);
      // Return result for UI feedback
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Logout user
   */
  const logout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('isAuthenticated');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const forgotPassword = async (email) => {
    try {
      // TODO: Implement actual API call for password reset
      // const response = await axios.post('/api/auth/forgot-password', { email });
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 