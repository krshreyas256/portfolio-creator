import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import app from "./config";

const db = getFirestore(app);

export const createUserProfile = async (user, name) => {
  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    name: name,
    email: user.email,
    createdAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);

  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    return userSnapshot.data();
  }

  return null;
};

export const createPortfolio = async (userId) => {
  const portfolioRef = await addDoc(collection(db, "portfolios"), {
    userId,

    slug: "",

    published: false,

    template: "modern",

    personal: {
      name: "",
      title: "",
      profileImage: "",
      location: "",
    },

    about: "",

    skills: [],

    education: [],

    experience: [],

    projects: [],

    certifications: [],

    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },

    contact: {
      email: "",
      phone: "",
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return portfolioRef.id;
};

export const getPortfolio = async (portfolioId) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  const portfolioSnapshot = await getDoc(portfolioRef);

  if (portfolioSnapshot.exists()) {
    return {
      id: portfolioSnapshot.id,
      ...portfolioSnapshot.data(),
    };
  }

  return null;
};

export const updatePortfolio = async (portfolioId, data) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  await updateDoc(portfolioRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export { db };