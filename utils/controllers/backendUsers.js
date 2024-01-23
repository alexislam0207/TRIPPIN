import { updateProfile } from "@firebase/auth";
import { auth, db } from "../../firebaseconfig";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const usersRef = collection(db, "users");

export const getUsers = async () => {
  try {
    const { docs } = await getDocs(usersRef);
    return docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (err) {
    return err;
  }
};

const getUserByName = async (username) => {
  try {
    const q = query(usersRef, where("username", "==", username));
    const { docs } = await getDocs(q);

     const user = docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))[0];
    return user
  } catch (err) {
    return err;
  }
};

export const patchUser = async (userId, field, input) => {
  const validFields = ['avatar', 'bio']
  const docRef = doc(db, "users", userId);
  const data = { [field]: input };

  if (validFields.includes(field)) {
    try {
      await updateDoc(docRef, data);
    } catch (err) {
      return err
    }
  } else if (field === 'username') {
    const existingUser = await getUserByName(input)
    if (existingUser) return {msg: `Username '${input}' is not available.`}
    else {
      try {
        await updateProfile(auth?.currentUser, { displayName: input });
        await updateDoc(docRef, data);
      } catch (err) {
        return err
      }
    }
  } else {
    return {msg: `'${field}' is not a valid field for a user collection.`}
  }
};

export {getUserByName}