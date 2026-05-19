/**
 * Utility functions for managing client-side JWT tokens
 */

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const removeStoredToken = () => {
  localStorage.removeItem('token');
};
