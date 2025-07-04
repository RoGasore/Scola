
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import type { SupportTicket } from '@/types';
import { getAllSupportTickets } from '@/services/support';
import SupportLoading from './loading';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type Status = 'new' | 'seen' | 'resolved';

export default function SupportPage() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

    const ticketIdParam = searchParams.get('ticketId');

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const tickets = await getAllSupportTickets();
            setAllTickets(tickets);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les tickets.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);
    
    const ticketCounts = useMemo(() => {
        return {
            all: allTickets.length,
            new: allTickets.filter(t => t.status === 'new').length,
            seen: allTickets.filter(t => t.status === 'seen').length,
            resolved: allTickets.filter(t => t.status === 'resolved').length,
        }
    }, [allTickets]);

    useEffect(() => {
        let tickets = allTickets;
        if (statusFilter !== 'all') {
            tickets = tickets.filter(t => t.status === statusFilter);
        }
        setFilteredTickets(tickets);
    }, [statusFilter, allTickets]);
    
    useEffect(() => {
        if (ticketIdParam && !isLoading) {
            const element = document.getElementById(`ticket-${ticketIdParam}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-primary/10', 'ring-2', 'ring-primary');
                setTimeout(() => {
                     element.classList.remove('bg-primary/10', 'ring-2', 'ring-primary');
                }, 5000);
            }
        }
    }, [ticketIdParam, isLoading]);


    if (isLoading) {
        return <SupportLoading />;
    }

    const getStatusBadge = (status: Status) => {
        switch (status) {
            case 'new': return <Badge variant="destructive">Nouveau</Badge>;
            case 'seen': return <Badge variant="secondary">Vu</Badge>;
            case 'resolved': return <Badge className="bg-green-500/80 text-white hover:bg-green-500">Résolu</Badge>;
            default: return <Badge variant="outline">Inconnu</Badge>;
        }
    };
    
    return (
        <div className="flex flex-col gap-6">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Tickets de Support</h1>
                <p className="text-muted-foreground">
                    Consultez et répondez aux demandes d'assistance des utilisateurs.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'all')}>
                        <TabsList>
                            <TabsTrigger value="all" className="gap-2">Tous <Badge variant={statusFilter === 'all' ? 'default' : 'secondary'}>{ticketCounts.all}</Badge></TabsTrigger>
                            <TabsTrigger value="new" className="gap-2">Nouveaux <Badge variant={statusFilter === 'new' ? 'default' : 'secondary'}>{ticketCounts.new}</Badge></TabsTrigger>
                            <TabsTrigger value="seen" className="gap-2">Vus <Badge variant={statusFilter === 'seen' ? 'default' : 'secondary'}>{ticketCounts.seen}</Badge></TabsTrigger>
                            <TabsTrigger value="resolved" className="gap-2">Résolus <Badge variant={statusFilter === 'resolved' ? 'default' : 'secondary'}>{ticketCounts.resolved}</Badge></TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map(ticket => (
                                    <TableRow key={ticket.id} id={`ticket-${ticket.id}`} className="transition-all duration-300">
                                        <TableCell>
                                            <div className="font-medium">{ticket.userName}</div>
                                            <div className="text-sm text-muted-foreground">{ticket.userRole}</div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="truncate max-w-xs" title={ticket.message}>{ticket.message}</p>
                                        </TableCell>
                                        <TableCell>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: fr })}</TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/auth/support/${ticket.id}`}>Voir le ticket</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Aucun ticket trouvé pour ce filtre.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
