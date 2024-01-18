// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBlaO_Gui5iM6GThA2fcAsNNpZRZHxf-ac",

  authDomain: "automated-payroll-832de.firebaseapp.com",

  databaseURL: "https://automated-payroll-832de-default-rtdb.firebaseio.com",

  projectId: "automated-payroll-832de",

  storageBucket: "automated-payroll-832de.appspot.com",

  messagingSenderId: "704961505516",

  appId: "1:704961505516:web:eb0776a27dbd378c5bddc9"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export {app}
const auth = getAuth(app)

