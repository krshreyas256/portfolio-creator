import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
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

export { db };