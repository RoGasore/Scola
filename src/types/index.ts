
export type StudentStatus = 'Actif' | 'Inactif' | 'En attente' | 'Transféré';

export interface Student {
    id?: string; // Firestore document ID
    matricule: string;
    password?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email?: string;
    phone?: string;
    dob: string; // ISO String
    pob: string;
    address: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    level: string;
    classe: string;
    section?: string;
    option?: string;
    status: StudentStatus;
    dateJoined: string; // ISO string
    avatar: string; // AI hint for placeholder generation
    cover: string; // AI hint
}

export interface Communique {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    subject: string;
    recipients: string[];
    date: string;
    status: { read: number; unread: number };
    content: string;
    attachments: { name: string; size: string }[];
    comments: {
        id: number;
        user: { name: string; avatar: string };
        text: string;
        time: string;
    }[];
}
