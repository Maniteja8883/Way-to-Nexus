
"use client";

import { auth, app } from "@/lib/firebase";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    doc,
    getDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    Timestamp
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
 * Fetches a single persona by its ID from Firestore for the current user.
 * @param personaId - The ID of the persona to fetch.
 * @returns The persona data, or null if not found.
 */
export const getPersonaFromFirestore = async (personaId: string): Promise<Persona | null> => {
    const userId = getUserId();
    if (!userId) {
        return null;
    }

    const personaDocRef = doc(db, "users", userId, "personas", personaId);
    
    try {
        const docSnap = await getDoc(personaDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const persona: Persona = {
                id: docSnap.id,
                name: data.name,
                age: data.age,
                location: data.location,
                educationStage: data.educationStage,
                careerGoals: data.careerGoals,
                interests: data.interests,
                techComfort: data.techComfort,
                consentToStore: data.consentToStore,
                stream: data.stream,
                currentCourseOrJob: data.currentCourseOrJob,
                preferredLearningModes: data.preferredLearningModes,
                skills: data.skills,
                constraints: data.constraints,
                shareAnonymously: data.shareAnonymously,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
            };
            return persona;
        } else {
            console.warn(`Persona with ID ${personaId} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching persona with ID ${personaId}:`, error);
        throw new Error("Could not fetch persona.");
    }
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
            const persona: Persona = {
                id: doc.id,
                name: data.name,
                age: data.age,
                location: data.location,
                educationStage: data.educationStage,
                careerGoals: data.careerGoals,
                interests: data.interests,
                techComfort: data.techComfort,
                consentToStore: data.consentToStore,
                stream: data.stream,
                currentCourseOrJob: data.currentCourseOrJob,
                preferredLearningModes: data.preferredLearningModes,
                skills: data.skills,
                constraints: data.constraints,
                shareAnonymously: data.shareAnonymously,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            };
            personas.push(persona);
        });
        return personas;
    } catch (error) {
        console.error("Error fetching personas from Firestore:", error);
        throw new Error("Could not fetch personas.");
    }
};
