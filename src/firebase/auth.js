import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";

// Convert Firebase errors into user-friendly messages
const getAuthErrorMessage = (error) => {
  switch (error.code) {
    // Signup
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password should be at least 6 characters long.";

    // Login
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/user-not-found":
      return "No account was found with this email address.";

    case "auth/wrong-password":
      return "Incorrect email or password.";

    // Other errors
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    default:
      return "Something went wrong. Please try again.";
  }
};


// Register
export const registerUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};


// Login
export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};


// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Unable to log out. Please try again.");
  }
};


// Listen for authentication changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};


// Export auth if other files use it
export { auth };