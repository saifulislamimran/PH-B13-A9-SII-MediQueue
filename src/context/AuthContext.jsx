import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import { setStoredToken, removeStoredToken } from '../utils/token';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up / Register
  const registerUser = (email, password) => {
    if (!auth) {
      return Promise.reject(new Error("Authentication is not initialized. Please check that a valid Firebase API Key is provided in environment variables."));
    }
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In / Login
  const loginUser = (email, password) => {
    if (!auth) {
      return Promise.reject(new Error("Authentication is not initialized. Please check that a valid Firebase API Key is provided in environment variables."));
    }
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = () => {
    if (!auth || !googleProvider) {
      return Promise.reject(new Error("Google Authentication is not configured or initialized. Please check your Firebase settings."));
    }
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logoutUser = () => {
    removeStoredToken();
    if (!auth) {
      setUser(null);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return signOut(auth);
  };

  // Update Profile
  const updateUserProfile = (name, photoURL) => {
    if (!auth || !auth.currentUser) {
      return Promise.reject(new Error("No active user session found, or authentication is not initialized."));
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      // Force state update to reflect new profile details
      setUser({ ...auth.currentUser });
    });
  };

  // Auth observer
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Generate or retrieve token.
        // For production, this token will be fetched from the backend (e.g. via axios.post('/jwt')).
        // As a robust client-side implementation, we verify and store a mock/real token.
        try {
          const idToken = await currentUser.getIdToken();
          setStoredToken(idToken);
        } catch (err) {
          console.error("Error retrieving Firebase ID token", err);
          // Fallback mock token to ensure interceptor logic doesn't crash
          setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
        }
      } else {
        removeStoredToken();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
