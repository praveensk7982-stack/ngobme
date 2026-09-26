import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkGx72ZPfx9Xgy5avkp8FXEwepKyGDvSE",
  authDomain: "tamil-nadu-ngo-connect-web.firebaseapp.com",
  projectId: "tamil-nadu-ngo-connect-web",
  storageBucket: "tamil-nadu-ngo-connect-web.firebasestorage.app",
  messagingSenderId: "667505644089",
  appId: "1:667505644089:web:c15d8ccd698261ef0db3e8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
