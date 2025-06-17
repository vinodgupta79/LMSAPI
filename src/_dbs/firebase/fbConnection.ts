import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    // apiKey: "AIzaSyAFOI2VcbiLLaXYXnSd-SAB4VQHOKAs9cU",
    // authDomain: "remitwisein-c255e.firebaseapp.com",
    // databaseURL: "https://remitwisein-c255e-default-rtdb.firebaseio.com",
    // projectId: "remitwisein-c255e",
    // storageBucket: "remitwisein-c255e.appspot.com",
    // messagingSenderId: "530990701738",
    // appId: "1:530990701738:web:7b17bccddb1334ebc244d3"
    apiKey: "AIzaSyCryZy8khOJ_D0wpWLKYHLsHhjijdNlH9Q",
    authDomain: "remitwise-757b9.firebaseapp.com",
    projectId: "remitwise-757b9",
    storageBucket: "remitwise-757b9.appspot.com",
    messagingSenderId: "154397228838",
    appId: "1:154397228838:web:6680140009e71152df4be7"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);


export {
    db, analytics
}