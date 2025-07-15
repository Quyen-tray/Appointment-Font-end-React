
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqCtOctb9DddGPASuWsAM_6BujNrDClE4",
  authDomain: "kivicare-deadf.firebaseapp.com",
  projectId: "kivicare-deadf",
  storageBucket: "kivicare-deadf.appspot.com",
  messagingSenderId: "500698803990",
  appId: "1:500698803990:web:668546c42ba7aa5fd16a37",
  measurementId: "G-DSXCRKVQJE"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
