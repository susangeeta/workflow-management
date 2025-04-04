// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2sxnM0ZpZfO7rXulU1hApNUfvVzUnrWs",
  authDomain: "workflow-management-1c333.firebaseapp.com",
  projectId: "workflow-management-1c333",
  storageBucket: "workflow-management-1c333.appspot.com",
  messagingSenderId: "759709083063",
  appId: "1:759709083063:web:80b826ac09a4cb82a33432"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
