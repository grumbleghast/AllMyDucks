/**
 * User service for handling user profile operations
 */
import api from './api';

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
const getProfile = async () => {
  return await api.get('/auth/profile');
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.firstName - Optional new first name
 * @param {string} profileData.themePreference - Optional theme preference ('light' or 'dark')
 * @returns {Promise<Object>} Updated user profile data
 */
const updateProfile = async (profileData) => {
  return await api.put('/auth/profile', profileData);
};

/**
 * Update user password
 * @param {Object} passwordData - Password update data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @param {string} passwordData.confirmPassword - Confirmation of new password
 * @returns {Promise<Object>} Success message
 */
const updatePassword = async (passwordData) => {
  return await api.put('/auth/password', passwordData);
};

const userService = {
  getProfile,
  updateProfile,
  updatePassword
};

export default userService; 