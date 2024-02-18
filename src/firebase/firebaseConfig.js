import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoouL1vFe-6W0-XrGe5pjb_MZmd5NgqjI",
  authDomain: "simplisupply-logistics.firebaseapp.com",
  projectId: "simplisupply-logistics",
  storageBucket: "simplisupply-logistics.appspot.com",
  messagingSenderId: "259275641287",
  appId: "1:259275641287:web:0e405e5e5fdfd2db60c9e2",
  measurementId: "G-KCDKRESFZ5"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);