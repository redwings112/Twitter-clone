// Import required Firebase services
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBmuipXgNMM8yEGUGVJzn03SgAGFKnqXxY",
  authDomain: "trill-fcba4.firebaseapp.com",
  projectId: "trill-fcba4",
  storageBucket: "trill-fcba4.firebasestorage.app",
  messagingSenderId: "197651993656",
  appId: "1:197651993656:web:0eaf635693a8ad35d402cd",
  measurementId: "G-FZ85K40ZW6",
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);  // Initialize Firebase
} else {
  app = getApp(); // Use the already initialized app
}

// Get Firestore, Auth, and Storage instances
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage



// Export instances
export { app, auth, db, storage };
