import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyyOG7XgHU54XHnEiA8gadICBPvF1scJs",
  authDomain: "expo-nusmartjudging.firebaseapp.com",
  databaseURL: "https://expo-nusmartjudging-default-rtdb.firebaseio.com",
  projectId: "expo-nusmartjudging",
  storageBucket: "expo-nusmartjudging.firebasestorage.app",
  messagingSenderId: "189927513883",
  appId: "1:189927513883:web:56385dd2d31ffb6a8e7dbe",
  measurementId: "G-DMEEHGEFYL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);