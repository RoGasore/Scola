
import { db } from '@/lib/firebase';
import type { SupportTicket, TicketMessage } from '@/types';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc, getDoc, where, arrayUnion } from "firebase/firestore";

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

export async function getSupportTicketById(ticketId: string): Promise<SupportTicket | null> {
    const ticketRef = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
        return null;
    }
    
    const ticketData = ticketSnap.data() as SupportTicket;

    // If admin opens a 'new' ticket, update its status to 'seen'
    if (ticketData.status === 'new') {
        await updateDoc(ticketRef, { status: 'seen' });
        ticketData.status = 'seen'; // Update the returned object as well
    }
    
    return { id: ticketSnap.id, ...ticketData };
}

export async function getNewTicketCount(): Promise<number> {
    try {
        const q = query(collection(db, SUPPORT_TICKETS_COLLECTION), where("status", "==", "new"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error getting new ticket count:", error);
        return 0;
    }
}


export async function updateTicketStatus(ticketId: string, status: 'new' | 'seen' | 'resolved'): Promise<void> {
    const ticketRef = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, { status: status });
}


export async function addMessageToTicket(ticketId: string, message: TicketMessage): Promise<void> {
    const ticketRef = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(ticketRef, {
        conversation: arrayUnion(message),
        status: 'seen' // When admin replies, mark as seen
    });
}
