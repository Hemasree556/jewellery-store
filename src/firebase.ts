import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// Your custom Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-dgi3VUbM-9BB2V7kp3FPFINIDZfYNkI",
  authDomain: "haara-4f89b.firebaseapp.com",
  projectId: "haara-4f89b",
  storageBucket: "haara-4f89b.firebasestorage.app",
  messagingSenderId: "463709187209",
  appId: "1:463709187209:web:3ad31b0a353a792d66ea58",
  measurementId: "G-EC1905KWD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Simple connection validation helper
async function verifyFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firebase connection is offline. Please check your credentials or network rules.");
    }
  }
}

verifyFirebaseConnection();

export default app;
