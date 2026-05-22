import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isMockAuth } from '../firebase/firebase.config';
import { setStoredToken, removeStoredToken } from '../utils/token';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get mock database of users from localStorage
  const getMockUsersDB = () => {
    try {
      const db = localStorage.getItem("mock_users_db");
      return db ? JSON.parse(db) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save mock database
  const saveMockUsersDB = (db) => {
    localStorage.setItem("mock_users_db", JSON.stringify(db));
  };

  // Sign Up / Register
  const registerUser = (email, password, role = 'student') => {
    if (isMockAuth) {
      setLoading(true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const db = getMockUsersDB();
          if (db.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setLoading(false);
            return reject(new Error("Firebase: Error (auth/email-already-in-use)."));
          }
          const newUser = {
            uid: "mock-uid-" + Math.random().toString(36).substr(2, 9),
            email,
            password,
            displayName: email.split('@')[0],
            photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk",
            role: role || 'student'
          };
          db.push(newUser);
          saveMockUsersDB(db);
          setUser(newUser);
          setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
          localStorage.setItem("mock_user", JSON.stringify(newUser));
          setLoading(false);
          resolve({ user: newUser });
        }, 800);
      });
    }
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const uid = userCredential.user.uid;
      localStorage.setItem(`role_${uid}`, role || 'student');
      return userCredential;
    });
  };

  // Sign In / Login
  const loginUser = (email, password) => {
    if (isMockAuth) {
      setLoading(true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const db = getMockUsersDB();
          const foundUser = db.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (!foundUser) {
            setLoading(false);
            return reject(new Error("Firebase: Error (auth/user-not-found)."));
          }
          if (foundUser.password !== password) {
            setLoading(false);
            return reject(new Error("Firebase: Error (auth/wrong-password)."));
          }
          if (!foundUser.role) {
            foundUser.role = 'student';
          }
          setUser(foundUser);
          setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
          localStorage.setItem("mock_user", JSON.stringify(foundUser));
          setLoading(false);
          resolve({ user: foundUser });
        }, 800);
      });
    }
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = () => {
    if (isMockAuth) {
      setLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockGoogleUser = {
            uid: "mock-uid-google-12345",
            email: "google.user@example.com",
            displayName: "Google Tester",
            photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk",
            role: "student"
          };
          setUser(mockGoogleUser);
          setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
          localStorage.setItem("mock_user", JSON.stringify(mockGoogleUser));
          setLoading(false);
          resolve({ user: mockGoogleUser });
        }, 800);
      });
    }
    setLoading(true);
    return signInWithPopup(auth, googleProvider).then((userCredential) => {
      const uid = userCredential.user.uid;
      const savedRole = localStorage.getItem(`role_${uid}`) || 'student';
      localStorage.setItem(`role_${uid}`, savedRole);
      return userCredential;
    });
  };

  // Logout
  const logoutUser = () => {
    removeStoredToken();
    localStorage.removeItem("mock_user");
    if (isMockAuth) {
      setUser(null);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return signOut(auth);
  };

  // Update Profile
  const updateUserProfile = (name, photoURL, role) => {
    if (isMockAuth) {
      const stored = localStorage.getItem("mock_user");
      const activeUser = user || (stored ? JSON.parse(stored) : null);
      if (!activeUser) return Promise.reject(new Error("No active user session found."));
      const updatedUser = {
        ...activeUser,
        displayName: name,
        photoURL: photoURL
      };
      if (role) {
        updatedUser.role = role;
      }
      setUser(updatedUser);
      localStorage.setItem("mock_user", JSON.stringify(updatedUser));
      
      // Update in db as well
      const db = getMockUsersDB();
      const userIndex = db.findIndex(u => u.uid === activeUser.uid);
      if (userIndex !== -1) {
        db[userIndex] = { 
          ...db[userIndex], 
          displayName: name, 
          photoURL,
          ...(role ? { role } : {})
        };
        saveMockUsersDB(db);
      }
      return Promise.resolve();
    }
    if (!auth || !auth.currentUser) {
      return Promise.reject(new Error("No active user session found, or authentication is not initialized."));
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      const uid = auth.currentUser.uid;
      if (role) {
        localStorage.setItem(`role_${uid}`, role);
      }
      const savedRole = localStorage.getItem(`role_${uid}`) || 'student';
      // Force state update to reflect new profile details
      setUser({ 
        ...auth.currentUser, 
        displayName: name, 
        photoURL: photoURL,
        role: savedRole
      });
    });
  };

  // Auth observer
  useEffect(() => {
    if (isMockAuth) {
      // Pre-populate mock users database if it's empty
      try {
        const db = localStorage.getItem("mock_users_db");
        if (!db || JSON.parse(db).length === 0) {
          const defaultUser = {
            uid: "mock-uid-default-user",
            email: "test.mediqueue@example.com",
            password: "MediQueue123!",
            displayName: "Test Doctor",
            photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk",
            role: "admin"
          };
          localStorage.setItem("mock_users_db", JSON.stringify([defaultUser]));
        }
      } catch (e) {
        console.error("Error pre-populating mock db", e);
      }

      const savedMockUser = localStorage.getItem("mock_user");
      if (savedMockUser) {
        setUser(JSON.parse(savedMockUser));
        setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
      } else {
        setUser(null);
        removeStoredToken();
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const savedRole = localStorage.getItem(`role_${currentUser.uid}`) || 'student';
        setUser({
          ...currentUser,
          role: savedRole
        });
        try {
          const idToken = await currentUser.getIdToken();
          setStoredToken(idToken);
        } catch (err) {
          console.error("Error retrieving Firebase ID token", err);
          setStoredToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken");
        }
      } else {
        setUser(null);
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
