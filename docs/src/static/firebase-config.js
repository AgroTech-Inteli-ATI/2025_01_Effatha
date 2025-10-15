import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, 
         GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrXfRBC_QlFc4ez0wQivOYoR5DiI2Aobo",
  authDomain: "agrotech---effatha.firebaseapp.com",
  projectId: "agrotech---effatha",
  storageBucket: "agrotech---effatha.firebasestorage.app",
  messagingSenderId: "72149352701",
  appId: "1:72149352701:web:9fcb7f5ffcd5341f3dbe94",
  measurementId: "G-VPQ4ETYKVY"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };