

import { db } from '@/lib/firebase';
import type { Grade } from '@/types';
import { subMonths, formatISO } from 'date-fns';
import { collection, writeBatch, doc } from 'firebase/firestore';


// Mock data, in a real app this would come from Firestore
const allGrades: { [matriculeOrId: string]: any[] } = {
  'E24-M1-001': [
    { id: 'GRD001', course: 'Psychomotricité', evaluationType: 'Observation', evaluationDate: formatISO(subMonths(new Date(), 3)), grade: '18/20', score: 18, ponderation: 20, professeur: 'Mme. Kanza', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD002', course: 'Langage', evaluationType: 'Interrogation', evaluationDate: formatISO(subMonths(new Date(), 2)), grade: '15/20', score: 15, ponderation: 20, professeur: 'Mme. Kanza', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD009', course: 'Psychomotricité', evaluationType: 'Examen Fin de Semestre', evaluationDate: formatISO(subMonths(new Date(), 1)), grade: '19/20', score: 19, ponderation: 20, professeur: 'Mme. Kanza', semester: 2, period: 3, termId: 'term3' },
  ],
  'default': [
    { id: 'GRD003', course: 'Mathématiques', evaluationType: 'Interrogation', evaluationDate: formatISO(subMonths(new Date(), 4)), grade: '17/20', score: 17, ponderation: 20, professeur: 'M. Dupont', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD004', course: 'Français', evaluationType: 'Devoir', evaluationDate: formatISO(subMonths(new Date(), 3)), grade: '15/20', score: 15, ponderation: 20, professeur: 'M. Hugo', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD005', course: 'Physique', evaluationType: 'Examen', evaluationDate: formatISO(subMonths(new Date(), 2)), grade: '14/20', score: 14, ponderation: 20, professeur: 'Mme. Curie', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD006', course: 'Histoire', evaluationType: 'Interrogation', evaluationDate: formatISO(subMonths(new Date(), 2)), grade: '19/20', score: 19, ponderation: 20, professeur: 'M. Kabila', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD007', course: 'Anglais', evaluationType: 'Participation', evaluationDate: formatISO(subMonths(new Date(), 1)), grade: '18/20', score: 18, ponderation: 20, professeur: 'Mme. Diallo', semester: 2, period: 3, termId: 'term3' },
    { id: 'GRD008', course: 'Mathématiques', evaluationType: 'Devoir', evaluationDate: formatISO(subMonths(new Date(), 0)), grade: '16/20', score: 16, ponderation: 20, professeur: 'M. Dupont', semester: 2, period: 4, termId: 'term4' },
  ]
};

// This service simulates fetching grades for a specific student.
export async function getGradesForStudent(studentIdentifier: string, isId: boolean = false): Promise<any[]> {
  // In a real app, you would query Firestore for grades where studentMatricule === matricule or studentId === id
  // For this mock, we only have matricule-based keys for specific students
  // Adapt mock data to new Grade type for compatibility
  const studentGrades = (allGrades[studentIdentifier] || allGrades['default']).map(g => ({
      ...g,
      // This is a temporary adaptation for the old student view.
      // Ideally, the student view should be updated to use the new structure.
      type: g.evaluationType,
      date: g.evaluationDate,
      grade: `${g.score}/${g.ponderation}`,
  }));
  
  // Sort by date descending
  studentGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return Promise.resolve(studentGrades);
}

// New function to add a batch of grades for a new evaluation
export async function addGradesBatch(gradesData: Omit<Grade, 'id'>[]): Promise<void> {
    const batch = writeBatch(db);
    const gradesCollection = collection(db, "grades");

    gradesData.forEach(grade => {
        const newGradeRef = doc(gradesCollection); // Automatically generate a new document ID
        // Adapt the new data to the old 'grade' string format to avoid breaking existing views
        // This is a temporary measure. The whole app should move to score/ponderation.
        const compatibleGradeData = {
          ...grade,
          grade: `${grade.score}/${grade.ponderation}`,
          professeur: grade.professeur
        };
        batch.set(newGradeRef, compatibleGradeData);
    });

    await batch.commit();
}
