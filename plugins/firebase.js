import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0ynX-_7LmSNNH37jvJFE_IcRkE-bpiu0",
    authDomain: "loanmanager-e4fe7.firebaseapp.com",
    projectId: "loanmanager-e4fe7",
    storageBucket: "loanmanager-e4fe7.appspot.com",
    messagingSenderId: "551466384075",
    appId: "1:551466384075:web:3b879e7bdecdc7414ef94e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app)
export const signIn = signInWithEmailAndPassword;
export const storage = getStorage(app);