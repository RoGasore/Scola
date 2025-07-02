
import type { Communique } from '@/types';
import { format, subDays } from 'date-fns';

const communiquesData: Communique[] = [
  {
    id: 'COM001',
    author: {
        name: 'Direction Scolaire',
        avatar: 'school building'
    },
    subject: "Rappel : Réunion Parents-Professeurs",
    recipients: ['Parents'],
    date: format(subDays(new Date(), 2), 'dd/MM/yyyy HH:mm'),
    status: { read: 85, unread: 15 },
    content: "<p>Chers parents,</p><p>Ceci est un rappel amical pour la réunion parents-professeurs qui aura lieu ce <strong>vendredi à 17h00</strong>. Votre présence est vivement souhaitée pour discuter des progrès de votre enfant et des objectifs pour le reste de l'année.</p><p>Cordialement,</p><p>La Direction</p>",
    attachments: [{ name: 'Ordre_du_jour.pdf', size: '128 KB' }],
    comments: [
      { id: 1, user: { name: 'Parent de Léo Dubois', avatar: 'homme congolais' }, text: 'Bien reçu, merci. Serons-nous en mesure de rencontrer le professeur de mathématiques ?', time: 'il y a 2h' },
      { id: 2, user: { name: 'Direction Scolaire', avatar: 'school building' }, text: 'Oui, tous les professeurs titulaires seront disponibles pendant les deux premières heures.', time: 'il y a 1h' },
    ]
  },
  {
    id: 'COM002',
    author: {
        name: 'M. Dupont (Prof. de Sport)',
        avatar: 'homme noir'
    },
    subject: "Information : Journée sportive annuelle",
    recipients: ['Élèves', 'Parents'],
    date: format(subDays(new Date(), 10), 'dd/MM/yyyy HH:mm'),
    status: { read: 92, unread: 8 },
    content: "<p>Bonjour à tous,</p><p>La journée sportive annuelle se tiendra le <strong>30 juillet</strong>. N'oubliez pas vos tenues de sport ! Des médailles seront décernées aux vainqueurs de chaque épreuve.</p><p>Préparez-vous !</p>",
    attachments: [],
    comments: [
        { id: 1, user: { name: 'Lucas Moreau', avatar: 'homme congolais' }, text: 'Super ! Hâte de participer au tournoi de foot.', time: 'il y a 8 jours' },
    ]
  },
];


// In a real app, this would fetch from a 'communiques' collection in Firestore.
// For now, it simulates an async data fetch of static data.
export async function getRecentAnnouncements(): Promise<Communique[]> {
    // Return a sorted copy of the data by date
    const sortedData = [...communiquesData].sort((a, b) => {
      // A simple date parsing logic is needed since the format is dd/MM/yyyy HH:mm
      const [dayA, monthA, yearA] = a.date.split(' ')[0].split('/').map(Number);
      const [hourA, minuteA] = a.date.split(' ')[1].split(':').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA, hourA, minuteA);

      const [dayB, monthB, yearB] = b.date.split(' ')[0].split('/').map(Number);
      const [hourB, minuteB] = b.date.split(' ')[1].split(':').map(Number);
      const dateB = new Date(yearB, monthB - 1, dayB, hourB, minuteB);

      return dateB.getTime() - dateA.getTime();
    });
    return Promise.resolve(sortedData);
}
