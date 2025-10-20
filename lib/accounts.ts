import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Account {
  id: string;
  olaz: string;
  createdAt: Date;
  files: string[];
  followers: number;
  logs: number;
  mailIncluded: boolean;
  platform: string;
  price: number;
  status: string;
}

export async function getAccounts() {
  const accountsRef = collection(db, 'uploads');
  const q = query(accountsRef, where('status', '==', 'Available'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Account[];
}