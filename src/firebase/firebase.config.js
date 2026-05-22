import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const getEnv = (key) => {
  try {
    const metaEnv = import.meta.env;
    if (metaEnv) {
      if (metaEnv[key]) return metaEnv[key];
      if (metaEnv[`NEXT_PUBLIC_${key}`]) return metaEnv[`NEXT_PUBLIC_${key}`];
      if (metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
    }
  } catch {
    // Ignore metaEnv check if not supported
  }

  const globalEnv = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : {};
  const proc = globalEnv.process;
  if (proc && proc.env) {
    if (proc.env[key]) return proc.env[key];
    if (proc.env[`NEXT_PUBLIC_${key}`]) return proc.env[`NEXT_PUBLIC_${key}`];
    if (proc.env[`VITE_${key}`]) return proc.env[`VITE_${key}`];
  }

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

const isMockAuth = !auth || firebaseConfig.apiKey === "mock-api-key";

export { auth, googleProvider, isMockAuth };
