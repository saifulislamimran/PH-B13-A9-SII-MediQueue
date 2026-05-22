import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const getEnv = (key) => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[`NEXT_PUBLIC_${key}`]) return process.env[`NEXT_PUBLIC_${key}`];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  }
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (import.meta.env[`NEXT_PUBLIC_${key}`]) return import.meta.env[`NEXT_PUBLIC_${key}`];
      if (import.meta.env[`VITE_${key}`]) return import.meta.env[`VITE_${key}`];
    }
  } catch (err) {}
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY") || getEnv("VITE_FIREBASE_API_KEY") || getEnv("FIREBASE_API_KEY") || "mock-api-key",
  authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") || getEnv("VITE_FIREBASE_AUTH_DOMAIN") || getEnv("FIREBASE_AUTH_DOMAIN") || "mediqueue-mock.firebaseapp.com",
  projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID") || getEnv("VITE_FIREBASE_PROJECT_ID") || getEnv("FIREBASE_PROJECT_ID") || "mediqueue-mock",
  storageBucket: getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") || getEnv("VITE_FIREBASE_STORAGE_BUCKET") || getEnv("FIREBASE_STORAGE_BUCKET") || "mediqueue-mock.appspot.com",
  messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") || getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || getEnv("FIREBASE_MESSAGING_SENDER_ID") || "123456789",
  appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID") || getEnv("VITE_FIREBASE_APP_ID") || getEnv("FIREBASE_APP_ID") || "1:123456789:web:abcdef"
};

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
