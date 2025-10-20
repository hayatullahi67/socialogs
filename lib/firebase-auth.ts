import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export async function signUpWithFirebase(email: string, password: string, username: string) {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      username,
      email,
      walletBalance: 0,
      purchasedAccounts: 0,
      createdAt: new Date()
    })

    return {
      success: true,
      message: 'Account created successfully!',
      user: userCredential.user
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function signInWithFirebase(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      success: true,
      message: 'Logged in successfully!',
      user: userCredential.user
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}