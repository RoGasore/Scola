
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
    recipients: ['Parents', 'Tous'],
    date: format(subDays(new Date(), 2), 'dd/MM/yyyy HH:mm'),
    time: "il y a 2 jours",
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
    recipients: ['Élèves', 'Parents', 'Tous'],
    date: format(subDays(new Date(), 10), 'dd/MM/yyyy HH:mm'),
    time: "il y a 10 jours",
    status: { read: 92, unread: 8 },
    content: "<p>Bonjour à tous,</p><p>La journée sportive annuelle se tiendra le <strong>30 juillet</strong>. N'oubliez pas vos tenues de sport ! Des médailles seront décernées aux vainqueurs de chaque épreuve.</p><p>Préparez-vous !</p>",
    attachments: [],
    comments: [
        { id: 1, user: { name: 'Lucas Moreau', avatar: 'homme congolais' }, text: 'Super ! Hâte de participer au tournoi de foot.', time: 'il y a 8 jours' },
    ]
  },
   {
    id: 'COM003',
    author: {
        name: 'Administration ScolaGest',
        avatar: 'administration office'
    },
    subject: "Mise à jour de la plateforme",
    recipients: ['Professeurs'],
    date: format(subDays(new Date(), 1), 'dd/MM/yyyy HH:mm'),
    time: "il y a 1 jour",
    status: { read: 98, unread: 2 },
    content: "<p>Chers professeurs,</p><p>Une mise à jour de la plateforme ScolaGest sera déployée ce soir à 22h00. Une interruption de service de 15 minutes est à prévoir. La nouvelle version inclura des améliorations pour l'encodage des notes.</p><p>Merci pour votre compréhension.</p>",
    attachments: [],
    comments: []
  },
];


// In a real app, this would fetch from a 'communiques' collection in Firestore.
export async function getRecentAnnouncements(role: 'admin' | 'student' | 'teacher' = 'admin'): Promise<Communique[]> {
    
    let filteredData = communiquesData;

    if (role === 'student') {
        filteredData = communiquesData.filter(c => c.recipients.includes('Élèves') || c.recipients.includes('Tous'));
    } else if (role === 'teacher') {
        filteredData = communiquesData.filter(c => c.recipients.includes('Professeurs') || c.recipients.includes('Tous'));
    }
    // Admin sees all

    const sortedData = [...filteredData].sort((a, b) => {
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
