import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcibGlYwrQcnPBtaV-G_tfGL3POlxrrAo",
  authDomain: "hackathon-vol3.firebaseapp.com",
  projectId: "hackathon-vol3",
  storageBucket: "hackathon-vol3.appspot.com",
  messagingSenderId: "55955625369",
  appId: "1:55955625369:web:6f1a4eb0a0de4a17856f08",
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
