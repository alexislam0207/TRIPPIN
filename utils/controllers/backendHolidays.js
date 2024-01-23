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
import { holidayTitleCheck, locationChecker, dateValidator } from "./controllerUtils";

export const getHolidays = async (userId) => {
  const holidayRef = collection(db, "users", userId, "holidays");
  const q = query(holidayRef, orderBy('startDate'))
  try {
    const { docs } = await getDocs(q);
    return docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (err) {
    return err;
  }
};

export const getHoliday = async (userId, holidayId) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId);
  try {
    const docSnap = await getDoc(docRef);
    const holData = docSnap.data()
    if (holData) return holData;
    else return {msg: 'Holiday not found.'}
  } catch (err) {
    return err
  }
};

export const postHoliday = async (userId, title, location) => {
  const holidayRef = collection(db, "users", userId, "holidays");
  const currentDate = Timestamp.now();
  
  const validTitle = await holidayTitleCheck(userId, title)
  const validLocation = await locationChecker(location)

  if (!validTitle) {
    return {msg: `You already have a holiday called '${title}'.`}
  } else if (!validLocation) {
    return {msg: `Invalid location data.`}
  } else {
    const currentLocation = new GeoPoint(location.latitude, location.longitude);
    const data = {
      title: title,
      locationData: currentLocation,
      startDate: currentDate,
    };
    try {
      const newDoc = await addDoc(holidayRef, data);
      return ({...data, id: newDoc.id})
    } catch (err) {
      return err
    }
  }
};

export const patchHoliday = async (userId, holidayId, field, input) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId);
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
    case 'info': return tryPatch()
    case 'locationData':
      const validLocation = await locationChecker(input)
      return validLocation ? tryPatch() : {msg: `Invalid location data.`}
    case 'startDate':
      const validDate = await dateValidator(input)
      const inputDate = new Date(input)
      const newDate = Timestamp.fromDate(inputDate)
      return validDate ? tryPatch(newDate) : {msg: `Invalid date/time input.`}
    case 'title':
      const validTitle = await holidayTitleCheck(userId, input)
      return validTitle ? tryPatch() : {msg: `You already have a holiday called '${input}'.`}
    default:
      return {msg: `'${field}' is not a valid field in a holiday document.`} 
  }

}

export const deleteHoliday = async (userId, holidayId) => {
  const docRef = doc(db, "users", userId, "holidays", holidayId);
  try {
    const oldDoc = await getDoc(docRef)
    await deleteDoc(docRef);
    const oldDocData = oldDoc.data()
    return {msg: `Holiday '${oldDocData.title}' deleted.`}
  } catch (err) {
    return err
  }
};