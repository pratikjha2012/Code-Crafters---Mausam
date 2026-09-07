// Firebase configuration for Mausam Web App
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFM1C5tojd7feITZ2GvBuJ5DtRzTxuAuM",
  authDomain: "mausam-3bc51.firebaseapp.com",
  projectId: "mausam-3bc51",
  storageBucket: "mausam-3bc51.firebasestorage.app",
  messagingSenderId: "146050287480",
  appId: "1:146050287480:web:1904cbbaf5d5664a92ea8d",
  measurementId: "G-6W2TS6RZMQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally to ensure SSR/safari compatibility
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
