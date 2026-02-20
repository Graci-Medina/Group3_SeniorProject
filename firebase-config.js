import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrO5KxeMWGtUSYCATNE6DI0a7V4UJu44U",
  authDomain: "copycookdatabase.firebaseapp.com",
  projectId: "copycookdatabase",
  storageBucket: "copycookdatabase.firebasestorage.app",
  messagingSenderId: "798399811699",
  appId: "1:798399811699:web:f821d9503369de838cda06",
  measurementId: "G-MSMRF8RYKF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);