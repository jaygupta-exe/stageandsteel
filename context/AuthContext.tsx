"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
} from "firebase/auth";
import {
  auth,
  db,
  doc,
  setDoc,
  serverTimestamp,
  googleProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  isFirebaseConfigured,
} from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseReady: boolean;
  isAuthModalOpen: boolean;
  authMode: "signin" | "signup" | "forgot";
  openAuthModal: (mode?: "signin" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: "signin" | "signup" | "forgot") => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to persist and sync user data into Cloud Firestore
async function syncUserToFirestore(firebaseUser: User, customName?: string) {
  if (!db || !firebaseUser) return;
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(
      userRef,
      {
        uid: firebaseUser.uid,
        name: customName || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Athlete",
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Firestore user sync warning:", err);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await syncUserToFirestore(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: "signin" | "signup" | "forgot" = "signin") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error("Firebase Auth is not configured. Please add your credentials in .env.local.");
    }
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserToFirestore(result.user);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured. Please add your credentials in .env.local.");
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await syncUserToFirestore(result.user);
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured. Please add your credentials in .env.local.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      if (name.trim()) {
        await updateProfile(userCredential.user, { displayName: name.trim() });
        setUser({ ...userCredential.user, displayName: name.trim() });
      }
      await syncUserToFirestore(userCredential.user, name.trim());
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured. Please add your credentials in .env.local.");
    }
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseReady: isFirebaseConfigured,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
