import { GeoPoint, Timestamp, collection, getDocs, query, where } from "@firebase/firestore"
import { db } from "../../firebaseconfig";

const titleCheck = async (q) => {
    const {docs} = await getDocs(q)
    const testArr = docs.map((doc) => ({
        ...doc.data()
    }))
    return testArr.length === 0
}

export const holidayTitleCheck = async (userId, title) => {
    const holidayRef = collection(db, "users", userId, "holidays");
    const q = query(holidayRef, where('title', '==', title))
    return titleCheck(q)
}

export const memoryTitleCheck = async (userId, holidayId, title) => {
    const memoryRef = collection(db, "users", userId, "holidays", holidayId, "memories");
    const q = query(memoryRef, where('title', '==', title))
    return titleCheck(q)
}

export const locationChecker = async (location) => {
    let currentLocation
    try {
        currentLocation = new GeoPoint(location.latitude, location.longitude);
    } catch (err) {
        return false
    }
    return currentLocation ? true : false
}

export const dateValidator = async (input) => {
    const inputDate = new Date(input)
    const iso = Timestamp.fromDate(inputDate)
    if (typeof iso.nanoseconds === 'number' && typeof iso.seconds === 'number' &&
        iso.nanoseconds !== 'NaN' && iso.seconds !== 'NaN'
        ) {
        
        return true
    } else return false
}

export const randomCode = () => {
    let code = '';
    const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const codeLength = 12;
  
    for (let i = 0; i < codeLength; i++) {
      code += alpha.charAt(Math.floor(Math.random() * alpha.length));
    }
  
    return code;
  };