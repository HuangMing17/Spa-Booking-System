// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail,
  linkWithCredential,
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
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Facebook Auth Provider
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

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
   * Sign in with Facebook
   * Xử lý Account Linking khi email đã tồn tại với provider khác
   * @returns {Promise} Firebase User object
   */
  signInWithFacebook: async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result;
    } catch (error) {
      // Xử lý trường hợp email đã tồn tại với provider khác (VD: Google)
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        // Lấy Facebook credential từ lỗi để link sau
        const pendingCredential = FacebookAuthProvider.credentialFromError(error);

        if (email) {
          // Tìm các phương thức đăng nhập đã liên kết với email này
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.includes("google.com")) {
            // Email đã đăng ký bằng Google → yêu cầu đăng nhập Google để link
            console.log("Email đã đăng ký bằng Google. Đang link Facebook...");

            // Đăng nhập bằng Google
            const googleResult = await signInWithPopup(auth, googleProvider);

            // Link Facebook credential vào tài khoản Google
            if (pendingCredential) {
              await linkWithCredential(googleResult.user, pendingCredential);
              console.log("Đã link Facebook vào tài khoản Google thành công!");
            }

            return googleResult;
          }
        }
      }

      console.error("Error during Facebook sign-in:", error);
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

