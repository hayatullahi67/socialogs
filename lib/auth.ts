import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signUp(email: string, password: string, username: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    username,
    email,
    walletBalance: 0,
    purchasedAccounts: 0,
    createdAt: new Date()
  });

  return userCredential.user;
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}