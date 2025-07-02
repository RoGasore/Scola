import type { Grade } from '@/types';
import { subMonths, formatISO } from 'date-fns';

const allGrades: { [matricule: string]: Grade[] } = {
  'E24-M1-001': [
    { id: 'GRD001', course: 'Psychomotricité', type: 'Participation', date: formatISO(subMonths(new Date(), 1)), grade: 'Très Bien', professeur: 'Mme. Kanza' },
    { id: 'GRD002', course: 'Langage', type: 'Interrogation', date: formatISO(subMonths(new Date(), 0)), grade: 'Acquis', professeur: 'Mme. Kanza' },
  ],
  'default': [
    { id: 'GRD003', course: 'Mathématiques', type: 'Interrogation', date: formatISO(subMonths(new Date(), 2)), grade: '17/20', professeur: 'M. Dupont' },
    { id: 'GRD004', course: 'Français', type: 'Devoir', date: formatISO(subMonths(new Date(), 1)), grade: '15/20', professeur: 'M. Hugo' },
    { id: 'GRD005', course: 'Physique', type: 'Examen', date: formatISO(subMonths(new Date(), 0)), grade: '14/20', professeur: 'Mme. Curie' },
    { id: 'GRD006', course: 'Histoire', type: 'Interrogation', date: formatISO(subMonths(new Date(), 1)), grade: '19/20', professeur: 'M. Kabila' },
    { id: 'GRD007', course: 'Anglais', type: 'Participation', date: formatISO(subMonths(new Date(), 0)), grade: '18/20', professeur: 'Mme. Diallo' },
  ]
};

// This service simulates fetching grades for a specific student.
export async function getGradesForStudent(matricule: string): Promise<Grade[]> {
  const studentGrades = allGrades[matricule] || allGrades['default'];
  
  // Sort by date descending
  studentGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return Promise.resolve(studentGrades);
}
