import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Persistence set to local storage'))
  .catch(error => console.error('Error setting persistence:', error));

export const db = getDatabase(app);
export { auth, provider };

