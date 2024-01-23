import { auth, db } from "../../firebaseconfig";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getUserByName } from "./backendUsers";
import { addDoc, collection, deleteDoc, doc } from "@firebase/firestore";

const postUser = async (username, email) => {
  const usersRef = collection(db, "users");
  try {
    await addDoc(usersRef, { username: username, email: email });
  } catch (err) {
    let user = auth?.currentUser;
    await deleteUser(user);
    return err
  }
};

const deleteUserDoc = async (userId) => {
  const docRef = doc(db, "users", userId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    return err
  }
};

export const createAccount = async (email, pass, username) => {
  if (!auth.currentUser) {
    const existingUser = await getUserByName(username);
    if (!existingUser) {
      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(newUser.user, { displayName: username });
        await postUser(username, newUser.user.email);
        return "user created";
      } catch (err) {
        return err;
      }
    } else {
      return {msg: `username: ${username} is already in use`};
    }
  } else {
    return {msg: `'${auth.currentUser.displayName}' is logged in.`};
  }
};

export const logIn = async (email, pass) => {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return "user successfully logged in";
    } catch (err) {
      return err;
    }
  } else {
    return {msg: `'${auth.currentUser.displayName}' is logged in.`};
  }
};

export const logOut = async () => await signOut(auth);

export const removeUser = async () => {
  let user = auth?.currentUser;
  try {
    const userID = await getUserByName(auth.currentUser.displayName);
    await deleteUser(user);
    await deleteUserDoc(userID.id);
    return {msg: `'${user.displayName}' deleted.`};
  } catch (err) {
    return err;
  }
};

export const signedInUser = async (bool) => {
  if (bool === 'bool') {
    if (auth?.currentUser) return true
    else return false
  } else if (auth?.currentUser) {
    return auth?.currentUser
  } else return {msg: 'No current user.'}
}
