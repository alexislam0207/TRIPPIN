import { collectionGroup, doc, getDoc, getDocs, query, updateDoc, where } from "@firebase/firestore";
import { db } from "../../firebaseconfig";
import { randomCode } from "./controllerUtils";

export const createShareLink = async (userId, holidayId) => {
    const docRef = doc(db, "users", userId, "holidays", holidayId);
    
    try {
        const theDoc = await getDoc(docRef)
        if (theDoc.data().shareLink) {
            return {msg: `'${theDoc.data().title}' already has a share link, it is '${theDoc.data().shareLink}'.`}
        } else {
            const shareCode = randomCode()
            const data = {shareLink: shareCode}
            
            try {
                await updateDoc(docRef, data);
                const newDoc = await getDoc(docRef)
                return newDoc.data()
            } catch (err) {
                return err
            }
        }
        
    } catch (err) {
        return err
    }
    
}

export const deleteShareLink = async (userId, holidayId) => {
    const docRef = doc(db, "users", userId, "holidays", holidayId);
    try {
        const theDoc = await getDoc(docRef)
        if (theDoc.data().shareLink) {
            await updateDoc(docRef, {shareLink: ''});
        } else {
            return {msg: `'${theDoc.data().title}' does not have a share link.`}
        }
    } catch (err) {
        return err
    }
}

export const getSharedLink = async (link) => {
    const allLinks = collectionGroup(db, 'holidays') 
    
    try {
        const { docs } = await getDocs(allLinks)
        const mappedDocs = docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));

        const filteredDocs = mappedDocs.filter((doc) => doc.shareLink === link)

        if (filteredDocs.length === 1) {
            const memoriesCollection = collectionGroup(db, 'memories')
            try {
                const memories = await getDocs(memoriesCollection)
                
                const mappedMemories = memories.docs.map((mem) => ({
                    ...mem.data(),
                    id: mem.id
                }))
                
                const filteredMemories = mappedMemories.filter((mem) => mem.holidayReference === filteredDocs[0].id)

                filteredDocs[0].memories = filteredMemories
                return filteredDocs[0]
            } catch (err) {
                return err
            }

        }
        else return {msg: 'Invalid link.'}
    } catch (err) {
        return err
    }
}