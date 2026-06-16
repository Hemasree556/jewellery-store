import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  setError: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user profile in Firestore
  const syncUserProfile = async (firebaseUser: FirebaseUser, displayNameInput?: string) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      const name = displayNameInput || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Valued Client";

      if (!userSnap.exists()) {
        const newProfile: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      } else {
        const data = userSnap.data();
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: data.displayName || name,
          photoURL: firebaseUser.photoURL || data.photoURL,
          createdAt: data.createdAt
        });
      }
    } catch (err) {
      console.error("Error syncing user profile in Firestore:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      let friendlyMessage = "Failed to sign in. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        friendlyMessage = "Incorrect email address or password. Please verify your details.";
      } else if (err.code === "auth/user-not-found") {
        friendlyMessage = "No account found with this email. Please sign up.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name in Firebase Auth
      await updateProfile(userCredential.user, { displayName: name });
      // Create user document in Firestore
      await syncUserProfile(userCredential.user, name);
    } catch (err: any) {
      let friendlyMessage = "Failed to create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "An account with this email address already exists.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Your password is too weak. Please use at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      let friendlyMessage = "Google sign-in was cancelled or suspended. Please try again.";
      if (err.code && err.code !== "auth/popup-closed-by-user") {
        friendlyMessage = `Google auth error: ${err.message}`;
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout error", err);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      let friendlyMessage = "Failed to send reset link. Please check your email.";
      if (err.code === "auth/user-not-found") {
        friendlyMessage = "No user found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Please enter a valid email address.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        error,
        setError
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
