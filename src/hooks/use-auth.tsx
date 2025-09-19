"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { SignUpFormValues } from '@/components/auth/SignUpForm';
import type { LoginFormValues } from '@/components/auth/LoginForm';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (data: SignUpFormValues) => Promise<User | null>;
  signInWithEmail: (data: LoginFormValues) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not initialized. Check your Firebase config.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  const signUpWithEmail = async (data: SignUpFormValues) => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up with email: ", error);
      throw error;
    }
  };
  
  const signInWithEmail = async (data: LoginFormValues) => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with email: ", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized.");
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };

  const value = { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut };

  if (!auth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-destructive-foreground p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Firebase Configuration Error</h1>
          <p>Could not connect to Firebase. Please check your configuration.</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
