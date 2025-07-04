import { db } from '@/lib/firebase';
import type { SupportTicket } from '@/types';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";

const SUPPORT_TICKETS_COLLECTION = 'support-tickets';

export async function addSupportTicketToDb(ticketData: Omit<SupportTicket, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, SUPPORT_TICKETS_COLLECTION), ticketData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding support ticket: ", e);
        throw new Error("Failed to add support ticket to the database.");
    }
}

export async function getRecentSupportTickets(count: number = 5): Promise<SupportTicket[]> {
    const q = query(collection(db, SUPPORT_TICKETS_COLLECTION), orderBy("createdAt", "desc"), limit(count));
    const querySnapshot = await getDocs(q);
    const tickets: SupportTicket[] = [];
    querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as SupportTicket);
    });
    return tickets;
}

export async function getAllSupportTickets(): Promise<SupportTicket[]> {
    const q = query(collection(db, SUPPORT_TICKETS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const tickets: SupportTicket[] = [];
    querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as SupportTicket);
    });
    return tickets;
}

export async function updateTicketStatus(ticketId: string, status: 'new' | 'seen' | 'resolved'): Promise<void> {
    const ticketRef = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, { status: status });
}
