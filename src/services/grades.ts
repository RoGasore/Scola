
import type { Grade } from '@/types';
import { subMonths, formatISO } from 'date-fns';

// Mock data, in a real app this would come from Firestore
const allGrades: { [matriculeOrId: string]: Grade[] } = {
  'E24-M1-001': [
    { id: 'GRD001', course: 'Psychomotricité', type: 'Participation', date: formatISO(subMonths(new Date(), 3)), grade: '18/20', professeur: 'Mme. Kanza', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD002', course: 'Langage', type: 'Interrogation', date: formatISO(subMonths(new Date(), 2)), grade: '15/20', professeur: 'Mme. Kanza', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD009', course: 'Psychomotricité', type: 'Observation', date: formatISO(subMonths(new Date(), 1)), grade: '19/20', professeur: 'Mme. Kanza', semester: 2, period: 3, termId: 'term3' },
  ],
  'default': [
    { id: 'GRD003', course: 'Mathématiques', type: 'Interrogation', date: formatISO(subMonths(new Date(), 4)), grade: '17/20', professeur: 'M. Dupont', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD004', course: 'Français', type: 'Devoir', date: formatISO(subMonths(new Date(), 3)), grade: '15/20', professeur: 'M. Hugo', semester: 1, period: 1, termId: 'term1' },
    { id: 'GRD005', course: 'Physique', type: 'Examen', date: formatISO(subMonths(new Date(), 2)), grade: '14/20', professeur: 'Mme. Curie', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD006', course: 'Histoire', type: 'Interrogation', date: formatISO(subMonths(new Date(), 2)), grade: '19/20', professeur: 'M. Kabila', semester: 1, period: 2, termId: 'term2' },
    { id: 'GRD007', course: 'Anglais', type: 'Participation', date: formatISO(subMonths(new Date(), 1)), grade: '18/20', professeur: 'Mme. Diallo', semester: 2, period: 3, termId: 'term3' },
    { id: 'GRD008', course: 'Mathématiques', type: 'Devoir', date: formatISO(subMonths(new Date(), 0)), grade: '16/20', professeur: 'M. Dupont', semester: 2, period: 4, termId: 'term4' },
  ]
};

// This service simulates fetching grades for a specific student.
export async function getGradesForStudent(studentIdentifier: string, isId: boolean = false): Promise<Grade[]> {
  // In a real app, you would query Firestore for grades where studentMatricule === matricule or studentId === id
  // For this mock, we only have matricule-based keys for specific students
  const studentGrades = allGrades[studentIdentifier] || allGrades['default'];
  
  // Sort by date descending
  studentGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return Promise.resolve(studentGrades);
}
