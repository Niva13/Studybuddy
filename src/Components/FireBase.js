"use client"
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserSessionPersistence  } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgzFsn9I59YGSuRqVCD6rEYFa_IAHQMMw",
  authDomain: "studybuddy-b3b5f.firebaseapp.com",
  projectId: "studybuddy-b3b5f",
  storageBucket: "studybuddy-b3b5f.firebasestorage.app",
  messagingSenderId: "680032230893",
  appId: "1:680032230893:web:647dab04b26a0dca3adbe4",
  measurementId: "G-LEKQ2MGQN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to inMemory");
  })
  .catch((error) => {
    console.error("Failed to set auth persistence:", error);
  });

export { auth, database, storage };