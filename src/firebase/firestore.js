import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import app from "./config";

const db = getFirestore(app);

/* =========================
   USER PROFILE
========================= */

export const createUserProfile = async (user, name) => {
  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    name,
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

/* =========================
   PORTFOLIO
========================= */

export const createPortfolio = async (userId) => {
  const portfolioRef = await addDoc(collection(db, "portfolios"), {
    userId,

    slug: "",
    published: false,
    template: "modern",

    /* =========================
       DRAFT DATA
    ========================= */

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

    /* =========================
       PUBLISHED SNAPSHOT

       This remains unchanged
       until Publish is clicked.
    ========================= */

    publishedData: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return portfolioRef.id;
};

/* =========================
   GET PORTFOLIO
   Used by Builder + Preview

   Returns DRAFT data.
========================= */

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

/* =========================
   UPDATE DRAFT
========================= */

export const updatePortfolio = async (portfolioId, data) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  const portfolioSnapshot = await getDoc(portfolioRef);

  if (!portfolioSnapshot.exists()) {
    throw new Error("Portfolio not found.");
  }

  const currentPortfolio = portfolioSnapshot.data();

  /*
   * ==========================================
   * OLD PUBLISHED PORTFOLIO MIGRATION
   * ==========================================
   *
   * Some portfolios were published before
   * publishedData existed.
   *
   * Before the first draft edit, preserve
   * the existing live version.
   */

  if (
    currentPortfolio.published &&
    !currentPortfolio.publishedData
  ) {
    const publishedData = {
      personal: currentPortfolio.personal || {},
      about: currentPortfolio.about || "",
      skills: currentPortfolio.skills || [],
      education: currentPortfolio.education || [],
      experience: currentPortfolio.experience || [],
      projects: currentPortfolio.projects || [],
      certifications: currentPortfolio.certifications || [],
      socialLinks: currentPortfolio.socialLinks || {},
      contact: currentPortfolio.contact || {},
      template: currentPortfolio.template || "modern",
    };

    await updateDoc(portfolioRef, {
      publishedData,

      /*
       * Apply the user's change to the
       * DRAFT fields only.
       */
      ...data,

      updatedAt: serverTimestamp(),
    });

    return;
  }

  /*
   * ==========================================
   * NORMAL DRAFT UPDATE
   * ==========================================
   *
   * IMPORTANT:
   *
   * Never modify publishedData here.
   */

  await updateDoc(portfolioRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/* =========================
   SLUG
========================= */

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

/* =========================
   PUBLISH PORTFOLIO
========================= */

export const publishPortfolio = async (
  portfolioId,
  slug
) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  const portfolioSnapshot = await getDoc(portfolioRef);

  if (!portfolioSnapshot.exists()) {
    throw new Error("Portfolio not found.");
  }

  const currentPortfolio = portfolioSnapshot.data();

  /*
   * ==========================================
   * COPY DRAFT → PUBLISHED
   * ==========================================
   *
   * These are the current draft values.
   */

  const publishedData = {
    personal: currentPortfolio.personal || {},
    about: currentPortfolio.about || "",
    skills: currentPortfolio.skills || [],
    education: currentPortfolio.education || [],
    experience: currentPortfolio.experience || [],
    projects: currentPortfolio.projects || [],
    certifications: currentPortfolio.certifications || [],
    socialLinks: currentPortfolio.socialLinks || {},
    contact: currentPortfolio.contact || {},
    template: currentPortfolio.template || "modern",
  };

  /*
   * ==========================================
   * THIS IS THE ONLY PLACE WHERE
   * PUBLISHED CONTENT CHANGES
   * ==========================================
   */

  await updateDoc(portfolioRef, {
    slug,
    published: true,
    publishedData,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return slug;
};

/* =========================
   PUBLIC PORTFOLIO
========================= */

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
  const data = portfolioDocument.data();

  /*
   * ==========================================
   * PUBLIC SITE MUST ONLY RECEIVE
   * PUBLISHED DATA
   * ==========================================
   */

  if (data.publishedData) {
    return {
      id: portfolioDocument.id,

      /*
       * Keep these metadata fields.
       */
      userId: data.userId,
      slug: data.slug,
      published: data.published,
      publishedAt: data.publishedAt,

      /*
       * Use ONLY the published snapshot
       * for portfolio content.
       */
      ...data.publishedData,
    };
  }

  /*
   * ==========================================
   * BACKWARD COMPATIBILITY
   * ==========================================
   *
   * If an older portfolio has not yet been
   * migrated, temporarily use its existing
   * data.
   */

  return {
    id: portfolioDocument.id,
    ...data,
  };
};

/* =========================
   USER PORTFOLIOS
========================= */

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

/* =========================
   DELETE PORTFOLIO
========================= */

export const deletePortfolio = async (portfolioId) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);

  await deleteDoc(portfolioRef);
};

/* =========================
   FIRESTORE INSTANCE
========================= */

export { db };