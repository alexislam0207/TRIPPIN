import { db } from "../../firebaseconfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  GeoPoint,
  orderBy,
} from "firebase/firestore";
import { dateValidator, locationChecker, memoryTitleCheck } from "./controllerUtils";

export const getMemories = async (userId, holidayId) => {
  const memoryRef = collection(db, "users", userId, "holidays", holidayId, "memories");
  const q = query(memoryRef, orderBy('date'))

  try {
      const { docs } = await getDocs(q);
      return docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (err) {
      return err;
    }
}

export const getMemory = async (userId, holidayId, memoryId) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId, "memories", memoryId);
  try {
    const docSnap = await getDoc(docRef);
    const memoryData = docSnap.data();
    if (memoryData) return memoryData
    else return {msg: 'Memory not found'} 
  } catch (err) {
    return err
  }
}

export const postMemory = async (userId, holidayId, title, location) => {
  const memoryRef = collection(db, "users", userId, "holidays", holidayId, "memories");
  const currentDate = Timestamp.now();

  const validTitle = await memoryTitleCheck(userId, holidayId, title)
  const validLocation = await locationChecker(location)

  if (!validTitle) {
    return {msg: `You already have a memory called '${title}'`}
  } else if (!validLocation) {
    return {msg: `Invalid location data`}
  } else {
    const currentLocation = new GeoPoint(location.latitude, location.longitude);
    const data = {
      title: title,
      locationData: currentLocation,
      date: currentDate,
      holidayReference: holidayId
    };
    try {
      const newDoc = await addDoc(memoryRef, data);
      return ({...data, id: newDoc.id})
    } catch (err) {
      return err
    }
  }
};

export const patchMemory = async (userId, holidayId, memoryId, field, input) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId, "memories", memoryId);
  const data = {[field]: input}

  const tryPatch = async (newDate) => {
    if (newDate) {
      data[field] = newDate
    }
    try {
      await updateDoc(docRef, data);
      const newDoc = await getDoc(docRef)
      return newDoc.data()
    } catch (err) {
      return err
    }
  }

  switch (field) {
    case 'note': return tryPatch()
    case 'locationData':
      const validLocation = await locationChecker(input)
      return validLocation ? tryPatch() : {msg: `Invalid location data.`}
    case 'date':
      const validDate = await dateValidator(input)
      const inputDate = new Date(input)
      const newDate = Timestamp.fromDate(inputDate)
      return validDate ? tryPatch(newDate) : {msg: `Invalid date/time input.`}
    case 'title':
      const validTitle = await memoryTitleCheck(userId, holidayId, input)
      return validTitle ? tryPatch() : {msg: `You already have a memory called '${input}'.`}
    default:
      return {msg: `'${field}' is not a valid field in a memory document.`} 
  }
}
  
export const deleteMemory = async (userId, holidayId, memoryId) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId, "memories", memoryId);
  try {
    const oldDoc = await getDoc(docRef)
    await deleteDoc(docRef);
    const oldDocData = oldDoc.data()
    return {msg: `Memory '${oldDocData.title}' deleted.`}
  } catch (err) {
    return err
  }
};