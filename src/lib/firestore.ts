
"use client";

import { auth, app } from "@/lib/firebase";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    serverTimestamp,
    query,
    where,
    orderBy
} from "firebase/firestore";
import type { Persona } from "@/lib/types";

if (!app) {
  throw new Error("Firebase has not been initialized. Please check your configuration.");
}

const db = getFirestore(app);

// Helper function to get the current user's UID
const getUserId = () => {
    const user = auth?.currentUser;
    if (!user) {
        // This could happen if the user is not logged in
        // or if the auth state hasn't been propagated yet.
        console.warn("User is not authenticated. Cannot perform Firestore operation.");
        return null;
    }
    return user.uid;
};

/**
 * Adds a new persona to Firestore for the current user.
 * @param personaData - The persona data to add, without the 'id'.
 * @returns The ID of the newly created persona document.
 */
export const addPersonaToFirestore = async (personaData: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const userId = getUserId();
    if (!userId) {
        throw new Error("User not authenticated. Cannot add persona.");
    }
    
    const personasCollectionRef = collection(db, "users", userId, "personas");
    
    const docRef = await addDoc(personasCollectionRef, {
        ...personaData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};

/**
 * Fetches all personas for the current user from Firestore.
 * @returns An array of the user's personas.
 */
export const getPersonasFromFirestore = async (): Promise<Persona[]> => {
    const userId = getUserId();
    if (!userId) {
        return []; // Return an empty array if there's no user
    }

    const personasCollectionRef = collection(db, "users", userId, "personas");
    const q = query(personasCollectionRef, orderBy("createdAt", "desc"));
    
    try {
        const querySnapshot = await getDocs(q);
        const personas: Persona[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            personas.push({
                id: doc.id,
                ...data,
                 // Timestamps might be null on the client until they are set by the server.
                 // Here we are just casting, but a more robust solution might handle this case.
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Persona);
        });
        return personas;
    } catch (error) {
        console.error("Error fetching personas from Firestore:", error);
        // Depending on the app's needs, you might want to re-throw the error
        // or handle it by returning an empty array or showing a user-facing error.
        throw new Error("Could not fetch personas.");
    }
};

