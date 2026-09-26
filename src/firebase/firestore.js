import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import app from "./config";

const db = getFirestore(app);

// ==========================================
// USER PROFILE
// ==========================================

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

// ==========================================
// PORTFOLIO
// ==========================================

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

// ==========================================
// PORTFOLIO PUBLISHING
// ==========================================

export const isSlugAvailable = async (slug) => {
  const portfoliosRef = collection(db, "portfolios");

  const slugQuery = query(
    portfoliosRef,
    where("slug", "==", slug),
    where("published", "==", true)
  );

  const snapshot = await getDocs(slugQuery);

  return snapshot.empty;
};

export const publishPortfolio = async (portfolioId, slug) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  const portfolioSnapshot = await getDoc(portfolioRef);

  if (!portfolioSnapshot.exists()) {
    throw new Error("Portfolio not found.");
  }

  const currentPortfolio = portfolioSnapshot.data();

  /*
   * If already published, never change the existing slug.
   */
  if (currentPortfolio.published && currentPortfolio.slug) {
    await updateDoc(portfolioRef, {
      published: true,
      updatedAt: serverTimestamp(),
    });

    return currentPortfolio.slug;
  }

  /*
   * First-time publishing.
   */
  await updateDoc(portfolioRef, {
    slug,
    published: true,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return slug;
};

export const getPublishedPortfolio = async (slug) => {
  const portfoliosRef = collection(db, "portfolios");

  const slugQuery = query(
    portfoliosRef,
    where("slug", "==", slug),
    where("published", "==", true)
  );

  const snapshot = await getDocs(slugQuery);

  if (snapshot.empty) {
    return null;
  }

  const portfolioDocument = snapshot.docs[0];

  return {
    id: portfolioDocument.id,
    ...portfolioDocument.data(),
  };
};

export const getUserPortfolios = async (userId) => {
  const portfoliosRef = collection(db, "portfolios");

  const portfolioQuery = query(
    portfoliosRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(portfolioQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

// ==========================================
// FIRESTORE DATABASE
// ==========================================

export { db };