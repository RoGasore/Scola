
import { db } from '@/lib/firebase';
import type { Student } from '@/types';
import { collection, addDoc, getDocs, query, where, limit, DocumentData } from "firebase/firestore";

export async function addStudent(studentData: Omit<Student, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, "students"), studentData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to add student to the database.");
    }
}

export async function getStudents(): Promise<Student[]> {
    const q = query(collection(db, "students"));
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    querySnapshot.forEach((doc: DocumentData) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
    });
    return students;
}

export async function getStudentByMatricule(matricule: string): Promise<Student | null> {
    const q = query(collection(db, "students"), where("matricule", "==", matricule), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }
    
    const doc: DocumentData = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Student;
}
