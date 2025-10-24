import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function signUpWithFirebase(
  email: string,
  password: string,
  username: string,
  phone?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName: username })

    // Save user profile in Firestore (users collection)
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      email,
      phone: phone || null,
      createdAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" }
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