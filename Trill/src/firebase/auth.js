import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Validate environment variables
const requiredEnvVars = ["apiKey", "authDomain", "projectId"];
requiredEnvVars.forEach((key) => {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing Firebase configuration for ${key}. Please check your environment variables.`);
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Utility function to map Firebase error codes to user-friendly messages.
 * @param {Object} error - Firebase error object.
 * @returns {string} - User-friendly error message.
 */
const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "The email address is already in use by another account.";
    case "auth/user-not-found":
      return "No user found with this email. Please register first.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/invalid-email":
      return "The email address is not valid. Please check and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait before trying again.";
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
};

/**
 * Register a new user with email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password (min. 6 characters).
 * @returns {Promise<{uid: string, email: string}>} - The user's UID and email.
 * @throws {Error} - Throws an error if registration fails.
 */
const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object directly
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Log in an existing user with email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<{uid: string, email: string}>} - The user's UID and email.
 * @throws {Error} - Throws an error if login fails.
 */
const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object directly
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Log out the currently authenticated user.
 * @returns {Promise<{message: string}>} - Success message on logout.
 * @throws {Error} - Throws an error if logout fails.
 */
const logout = async () => {
  try {
    await signOut(auth);
    return { message: "Logged out successfully" };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Export Firebase instances and functions
export { app, auth, registerWithEmailAndPassword, loginWithEmailAndPassword, logout };
