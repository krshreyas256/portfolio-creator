import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBn9SyRzXPryU4rNotdkNQNDNiomm2wfQc",
  authDomain: "portfolio-creator-c4115.firebaseapp.com",
  projectId: "portfolio-creator-c4115",
  storageBucket: "portfolio-creator-c4115.firebasestorage.app",
  messagingSenderId: "384293687986",
  appId: "1:384293687986:web:d3046f646992032aa62fab"
};

const app = initializeApp(firebaseConfig);

export default app;