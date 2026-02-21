import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
// Replace these values with your own Firebase project config
// Go to Firebase Console > Project Settings > Your Apps > Web App
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY").trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN").trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID").trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET").trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID").trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID").trim(),
};

console.log("🔧 Firebase Config loaded:");
console.log({
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + "...",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
});

// Check if we have placeholder values
if (firebaseConfig.apiKey.includes("YOUR_")) {
  console.error("❌ Firebase config has placeholder values! Environment variables not loaded!");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase app initialized");

// Initialize Firestore
const db = getFirestore(app);
console.log("✅ Firestore initialized");

// Initialize Authentication
const auth = getAuth(app);
console.log("✅ Firebase Auth initialized");

export { db, auth };
