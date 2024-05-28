// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl1FBtBcDb_wfZpQH-zbmB0ffgWXpn35A",
  authDomain: "plante-6e20f.firebaseapp.com",
  databaseURL: "https://plante-6e20f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plante-6e20f",
  storageBucket: "plante-6e20f.appspot.com",
  messagingSenderId: "206298724136",
  appId: "1:206298724136:web:ad2c40dee43521af45c21d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);