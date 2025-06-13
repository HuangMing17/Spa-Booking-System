// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH2w0ha5R60VyXPD--rOH_Jarwj9wjxIA",
  authDomain: "spa-fa1d5.firebaseapp.com",
  projectId: "spa-fa1d5",
  storageBucket: "spa-fa1d5.firebasestorage.app",
  messagingSenderId: "169005540758",
  appId: "1:169005540758:web:d8ca31b34d81b004b969b7",
  measurementId: "G-C7462B9J50",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Firebase Auth Service Functions
export const firebaseAuthService = {
  /**
   * Sign in with Google
   * @returns {Promise} Firebase User object
   */
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    }
  },

  /**
   * Get Firebase ID Token
   * @returns {Promise<string>} Firebase ID Token
   */
  getIdToken: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      throw new Error("No user is currently signed in");
    } catch (error) {
      console.error("Error getting ID token:", error);
      throw error;
    }
  },

  /**
   * Sign out from Firebase
   */
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return auth.currentUser;
  },
};

export default app;
