
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Loader2, CheckCircle } from 'lucide-react';
import type { SupportTicket } from '@/types';
import { getAllSupportTickets, updateTicketStatus } from '@/services/support';
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
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

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
    
    useEffect(() => {
        let tickets = allTickets;
        if (statusFilter !== 'all') {
            tickets = tickets.filter(t => t.status === statusFilter);
        }
        setFilteredTickets(tickets);
    }, [statusFilter, allTickets]);
    
    useEffect(() => {
        if (ticketIdParam) {
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

    const handleUpdateStatus = async (ticketId: string, status: Status) => {
        setIsUpdating(ticketId);
        try {
            await updateTicketStatus(ticketId, status);
            toast({ title: 'Statut mis à jour', description: 'Le statut du ticket a été modifié.', className: 'bg-green-500 text-white' });
            // Optimistically update the UI before re-fetching
            setAllTickets(prevTickets =>
                prevTickets.map(t =>
                    t.id === ticketId ? { ...t, status } : t
                )
            );
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le statut.' });
        } finally {
            setIsUpdating(null);
        }
    };

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
                            <TabsTrigger value="all">Tous</TabsTrigger>
                            <TabsTrigger value="new">Nouveaux</TabsTrigger>
                            <TabsTrigger value="seen">Vus</TabsTrigger>
                            <TabsTrigger value="resolved">Résolus</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Page</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                        <TableCell>
                                            <Link href={ticket.pageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {ticket.pageUrl.split('/').pop() || 'Page d\'accueil'}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: fr })}</TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={isUpdating === ticket.id}>
                                                        {isUpdating === ticket.id ? <Loader2 className="animate-spin"/> : <MoreHorizontal />}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {ticket.status !== 'seen' && <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'seen')}>Marquer comme Vu</DropdownMenuItem>}
                                                    {ticket.status !== 'resolved' && <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'resolved')}>Marquer comme Résolu</DropdownMenuItem>}
                                                    {/* Add details view later */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
