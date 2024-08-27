
import { 
    signInWithPopup, signInWithEmailAndPassword,
    createUserWithEmailAndPassword, updateProfile,
    fetchSignInMethodsForEmail,
} from "firebase/auth";

import { 
    ref, uploadBytes, getDownloadURL 
} from "firebase/storage"; 

import { db, auth, googleAuth, storage } from "./firebase"
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";

export const LoginResult = {
    SUCCESSFUL_LOGIN: 'SUCCESSFUL_LOGIN',
    UNSUCCESSFUL_LOGIN_NEED_TO_REGISTER: 'UNSUCCESSFUL_LOGIN_NEED_TO_REGISTER',
    UNSUCCESSFUL_LOGIN_INVALID_EMAIL: 'UNSUCCESSFUL_LOGIN_INVALID_EMAIL',
    UNSUCCESSFUL_LOGIN_WRONG_PASSWORD: 'UNSUCCESSFUL_LOGIN_WRONG_PASSWORD',
    UNSUCCESSFUL_LOGIN_FAILED_REGISTRATION: 'UNSUCCESSFUL_LOGIN_FAILED_REGISTRATION',
};

export const RegisterResult = {
    SUCCESSFUL_REGISTER: 'SUCCESSFUL_REGISTER',
    UNSUCCESSFUL_REGISTER_INVALID_EMAIL: 'UNSUCCESSFUL_REGISTER_INVALID_EMAIL',
    UNSUCCESSFUL_REGISTER_DUPLICATE_EMAIL: 'UNSUCCESSFUL_REGISTER_DUPLICATE_EMAIL',
    UNSUCCESSFUL_REGISTER_WEAK_PASSWORD: 'UNSUCCESSFUL_REGISTER_WEAK_PASSWORD',
    UNSUCCESSFUL_REGISTER_CREATE_USER: 'UNSUCCESSFUL_REGISTER_CREATE_USER',
};

export async function loginUserWithGoogle() {
    try {
        // Login user with Google
        const result = await signInWithPopup(auth, googleAuth);        
        // Signed in
        const user = result.user;

        try {
            const newUserDoc = await addUserDocumentRegisteredUID(user);
            if (newUserDoc) {
                console.log("New User Doc Added after Login with Google.");
            } else {
                console.log("Failed Adding New User Doc after Login with Google!");
            }
        } catch(error) {
            console.log("Unsuccessful adding new user doc after Login with Google!");
        }

        return user;  // return the authenticated user
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function isRegisteredUser(email) {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        console.log(signInMethods);
        return signInMethods.length > 0;  // If methods are returned, the user exists
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function registerUserWithEmailAndPassword(email, password, displayName, imageFile) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let photoURL = "";

        if (user && imageFile) {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, imageFile); // Upload image to Firebase storage
            photoURL = await getDownloadURL(storageRef); // Get the image URL
        }

        if (user) {
            try {
                // Update the user's profile
                await updateProfile(user, {
                    displayName: displayName,
                    photoURL: photoURL,
                });
                console.log("User profile updated successfully");
            } catch (error) {
                var errorCode = error?.code || "unknown";
                var errorMessage = error?.message || "An unknown error occurred";
                console.error("Error updating user profile:", errorMessage);
            }

            await user.reload();  // Reload user data
            return { user: user, registerResult: RegisterResult.SUCCESSFUL_REGISTER };                
        } else {
            var errorMessage = error?.message || "An unknown error occurred";
            console.log("Unsuccessful Register: Not Creating User!");
            return { user: null, registerResult: RegisterResult.UNSUCCESSFUL_REGISTER_CREATE_USER };                
        }
    } catch (error) {
        var errorCode = error?.code || "unknown";
        var errorMessage = error?.message || "An unknown error occurred";
        console.log("errorCode createUserWithEmailAndPassword: " + errorCode);

        if ( errorCode == 'auth/email-already-in-use' ) {
            console.log('You already have an account with that email.');
            return { user: null, registerResult: RegisterResult.UNSUCCESSFUL_REGISTER_DUPLICATE_EMAIL };                
        } else if ( errorCode == 'auth/invalid-email' ) {
            console.log('Please provide a valid email');
            return { user: null, registerResult: RegisterResult.UNSUCCESSFUL_REGISTER_INVALID_EMAIL };                
        } else if ( errorCode == 'auth/weak-password' ) {
            console.log('The password is too weak.');
            return { user: null, registerResult: RegisterResult.UNSUCCESSFUL_REGISTER_WEAK_PASSWORD };                
        } else {
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export async function loginUserWithEmailAndPassword(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;
        console.log("User signed in: ", user);
        await user.reload();  // Reload user data

        try {
            const newUserDoc = await addUserDocumentRegisteredUID(user);
            if (newUserDoc) {
                console.log("New User Doc Added");
            } else {
                console.log("Failed Adding New User Doc!");
            }
        } catch(error) {
            console.log("Unsuccessful adding new user doc!");
        }

        return { user: user, loginResult: LoginResult.SUCCESSFUL_LOGIN };
    } catch (error) {
        var errorCode = error?.code || "unknown";
        var errorMessage = error?.message || "An unknown error occurred";

        console.log("errorCode signInWithEmailAndPassword: " + errorCode);
        console.log("errorMessage signInWithEmailAndPassword: " + errorMessage);

        if (( errorCode === 'auth/user-not-found' ) || ( errorCode == 'auth/invalid-credential' )) {
            console.log('Need to register before login');
            return { user: null, loginResult: LoginResult.UNSUCCESSFUL_LOGIN_NEED_TO_REGISTER };       
        } else if ( errorCode === 'auth/wrong-password' ) {
            console.log('Wrong password. Please try again');
            return { user: null, loginResult: LoginResult.UNSUCCESSFUL_LOGIN_WRONG_PASSWORD };
        } else if ( errorCode == 'auth/invalid-email' ) {
            console.log('Please provide a valid email');
            return { user: null, loginResult: LoginResult.UNSUCCESSFUL_LOGIN_INVALID_EMAIL };
        } else {
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
    }
}

export async function getUserByEmail(userEmail) {
    const usersRef = collection(db, "users");  
    const q = query(usersRef, where("email", "==", userEmail));  

    try {
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (users.length === 0)
            return null;

        return users[0]; 
    } catch (error) {
        throw new Error(error.message);
    }
}


export async function getUserDocumentById(uid) {
    try {
        // Reference to the specific document in the "users" collection by user ID
        const userDocRef = doc(db, "users", uid);

        // Fetch the document from Firestore
        const userDocSnap = await getDoc(userDocRef);

        // Check if the document exists
        if (userDocSnap.exists()) {
            // Return the document data
            return userDocSnap.data();
        } else {
            // Document does not exist
            console.log("No such user!");
            return null;
        }
    } catch (error) {
        console.error("Error in Fetching User Document:", error);
        return null;
    }
}

export async function addUserDocumentRegisteredUID(user) {
    if (!user) {
        console.error("Invalid or Null User!");
        return;
    }

    try {
        const userDoc = await getUserDocumentById(user.uid);
        if (userDoc !== null) {
            console.error("Duplicated User!");
            return;
        }

        console.log("Before Adding New User...");

        // Reference to the document with the custom UID in the "users" collection
        const userDocRef = doc(db, "users", user.uid);

        // Add the document to Firestore with the custom UID
        await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
        });

        console.log("Document written with ID: ", userDocRef.id);
        console.log("userDocRef: ", userDocRef);
        return userDocRef;
    } catch (error) {
        console.error("Error in Adding New User Document: ", error.message);
    }
}
