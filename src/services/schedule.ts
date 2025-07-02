import type { Schedule } from '@/types';

// This service simulates fetching a student's weekly schedule.
// In a real app, this would be generated dynamically based on the student's courses and school's timetable.
const studentSchedules: { [matricule: string]: Schedule } = {
  'E24-M1-001': {
    Lundi: [
        { time: "08:00 - 09:50", course: "Psychomotricité", professeur: "Mme. Kanza", room: "Salle Polyvalente" },
        { time: "10:00 - 11:50", course: "Langage", professeur: "Mme. Kanza", room: "Salle 1" },
    ],
    Mardi: [
        { time: "08:00 - 09:50", course: "Éveil Artistique", professeur: "Mme. Kanza", room: "Atelier 1" },
        { time: "10:00 - 11:50", course: "Psychomotricité", professeur: "Mme. Kanza", room: "Salle Polyvalente" },
    ],
    Mercredi: [
        { time: "08:00 - 09:50", course: "Langage", professeur: "Mme. Kanza", room: "Salle 1" },
    ],
    Jeudi: [
        { time: "08:00 - 09:50", course: "Éveil Artistique", professeur: "Mme. Kanza", room: "Atelier 1" },
        { time: "10:00 - 11:50", course: "Langage", professeur: "Mme. Kanza", room: "Salle 1" },
    ],
    Vendredi: [
        { time: "08:00 - 09:50", course: "Psychomotricité", professeur: "Mme. Kanza", room: "Salle Polyvalente" },
    ],
  },
  'default': {
     Lundi: [
        { time: "08:00 - 09:50", course: "Mathématiques", professeur: "M. Dupont", room: "Salle 101" },
        { time: "10:00 - 11:50", course: "Français", professeur: "M. Hugo", room: "Salle 102" },
    ],
    Mardi: [
        { time: "08:00 - 09:50", course: "Physique", professeur: "Mme. Curie", room: "Labo 02" },
        { time: "10:00 - 11:50", course: "Histoire", professeur: "M. Kabila", room: "Salle 103" },
    ],
    Mercredi: [
        { time: "08:00 - 09:50", course: "Mathématiques", professeur: "M. Dupont", room: "Salle 101" },
        { time: "10:00 - 11:50", course: "Anglais", professeur: "Mme. Diallo", room: "Salle 201" },
    ],
    Jeudi: [
        { time: "08:00 - 09:50", course: "Français", professeur: "M. Hugo", room: "Salle 102" },
        { time: "10:00 - 11:50", course: "Physique", professeur: "Mme. Curie", room: "Labo 02" },
    ],
    Vendredi: [
        { time: "08:00 - 09:50", course: "Gymnastique", professeur: "M. Armstrong", room: "Gymnase" },
    ],
  }
};

export async function getScheduleForStudent(matricule: string): Promise<Schedule> {
  const schedule = studentSchedules[matricule] || studentSchedules['default'];
  return Promise.resolve(schedule);
}
