// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsUfUzoR2waKiACWAZxCjMwnXuv6e66RQ",
  authDomain: "official-you.firebaseapp.com",
  projectId: "official-you",
  storageBucket: "official-you.firebasestorage.app",
  messagingSenderId: "279225464268",
  appId: "1:279225464268:web:8a238c49e9ce67336dd969"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);