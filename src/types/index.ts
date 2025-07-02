
export type StudentStatus = 'Actif' | 'Inactif' | 'En attente' | 'Transféré';

export interface Student {
    id: string; // Firestore document ID
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

export interface Teacher {
    id: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    assignments: string[];
    status: 'Actif' | 'En congé';
    hireDate: string;
}

export interface Communique {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    subject: string;
    recipients: Array<'Parents' | 'Élèves' | 'Professeurs' | 'Tous'>;
    date: string;
    time?: string;
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


export interface Course {
    name: string;
    professeur: string;
    className: string;
    level: string;
    description: string;
    room: string;
}

export interface AcademicTerm {
    id: string;
    name: string;
    semester: number;
    period: number;
    startDate: string; // ISO String
    endDate: string; // ISO String
    isCurrent: boolean;
}

export interface Grade {
    id: string;
    course: string;
    type: 'Interrogation' | 'Examen' | 'Devoir' | 'Participation' | 'Observation';
    date: string; // ISO String
    grade: string; // e.g., "18/20", "A", "Très Bien", "Acquis", "Excellent"
    professeur: string;
    comment?: string;
    termId: string; // Link to AcademicTerm
    semester: number;
    period: number;
}

export interface ScheduleItem {
    time: string; // "08:00 - 09:50"
    course: string;
    professeur: string;
    room: string;
}

export interface Schedule {
    [day: string]: ScheduleItem[];
}
