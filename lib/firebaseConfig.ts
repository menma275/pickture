import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDCMe9rm-y-tSG0-n_no7wMj_aXq2hi9w",
  authDomain: "pickture-706de.firebaseapp.com",
  databaseURL: "https://pickture-706de-default-rtdb.firebaseio.com",
  projectId: "pickture-706de",
  storageBucket: "pickture-706de.appspot.com",
  messagingSenderId: "801205334573",
  appId: "1:801205334573:web:118d865776a7a76d24fea4",
  measurementId: "G-7TNMJBMFNJ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.log(error);
});

export { db, storage, auth };