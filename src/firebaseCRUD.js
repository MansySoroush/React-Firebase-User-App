import {
    addDoc, doc, getDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

import { db } from "./firebase.js"


export async function addUser(userEmail, name, userAge, userPhone, userCountry) {
    const usersRef = collection(db, "users");  

    const newUser = {
        email: userEmail,
        userName: name,
        age: userAge,
        phone: userPhone,
        country: userCountry,
    };

    try {
        // Add a new document with a generated ID
        const docRef = await addDoc(usersRef, newUser);
        console.log("User successfully added with ID: ", docRef.id);

        // Create a document reference for the newly added document
        const newDocRef = doc(db, 'users', docRef.id);

        // Fetch the newly added document data
        const newDoc = await getDoc(newDocRef);
        if (newDoc.exists()) {
            console.log("User Info:", newDoc.data());
            return newDoc.data();
        } else {
            console.log("No such user!");
        }
    } catch (error) {
        console.error("Error adding user: ", error);
    }

    return null;
}

export async function isNewUser(userEmail) {
    const result = await getUsersByEmail(userEmail);
    return (result.length === 0);
}

export async function getUsersByEmail(userEmail) {
    const usersRef = collection(db, "users");  
    const q = query(usersRef, where("email", "==", userEmail));  

    try {
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return users;  // Return the array of users
    } catch (error) {
        console.error("Error fetching users by email: ", error);
        throw new Error("Failed to fetch users");
    }
}
