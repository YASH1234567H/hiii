import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpVrVWC7Qt3ca2BB9vux-c6pj03iZQXEc",
  authDomain: "website-b5721.firebaseapp.com",
  projectId: "website-b5721",
  storageBucket: "website-b5721.firebasestorage.app",
  messagingSenderId: "229481506629",
  appId: "1:229481506629:web:33975e30a1c529cdb8c02c",
  measurementId: "G-K7PEQ8C7RN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, database, firestore };
