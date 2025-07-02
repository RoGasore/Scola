import { db } from '@/lib/firebase';
import type { AcademicTerm } from '@/types';
import { collection, getDocs, query, where, doc, writeBatch, addDoc } from "firebase/firestore";

const ACADEMIC_TERMS_COLLECTION = 'academic-terms';

export async function getAcademicTerms(): Promise<AcademicTerm[]> {
    const q = query(collection(db, ACADEMIC_TERMS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const terms: AcademicTerm[] = [];
    querySnapshot.forEach((doc) => {
        terms.push({ id: doc.id, ...doc.data() } as AcademicTerm);
    });
    // Sort by semester then period
    return terms.sort((a, b) => a.semester - b.semester || a.period - b.period);
}

export async function getCurrentAcademicTerm(): Promise<AcademicTerm | null> {
    const q = query(collection(db, ACADEMIC_TERMS_COLLECTION), where("isCurrent", "==", true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }
    
    const termDoc = querySnapshot.docs[0];
    return { id: termDoc.id, ...termDoc.data() } as AcademicTerm;
}

export async function addAcademicTerm(termData: Omit<AcademicTerm, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, ACADEMIC_TERMS_COLLECTION), termData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding academic term: ", e);
        throw new Error("Failed to add academic term to the database.");
    }
}

export async function setCurrentTerm(termIdToSet: string): Promise<void> {
    const termsRef = collection(db, ACADEMIC_TERMS_COLLECTION);
    const querySnapshot = await getDocs(termsRef);

    const batch = writeBatch(db);

    querySnapshot.forEach((document) => {
        const termRef = doc(db, ACADEMIC_TERMS_COLLECTION, document.id);
        if (document.id === termIdToSet) {
            batch.update(termRef, { isCurrent: true });
        } else if (document.data().isCurrent) {
            batch.update(termRef, { isCurrent: false });
        }
    });

    await batch.commit();
}
