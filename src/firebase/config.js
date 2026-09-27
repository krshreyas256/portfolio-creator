import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn9SyRzXPryU4rNotdkNQNDNiomm2wfQc",
  authDomain: "portfolio-creator-c4115.firebaseapp.com",
  projectId: "portfolio-creator-c4115",
  storageBucket: "portfolio-creator-c4115.firebasestorage.app",
  messagingSenderId: "384293687986",
  appId: "1:384293687986:web:d3046f646992032aa62fab"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// Named exports
export { db, auth };

// Default export for existing firestore.js
export default app;