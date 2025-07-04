
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, MessageSquare, Calendar, Link as LinkIcon, Image as ImageIcon, Mic, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { SupportTicket } from '@/types';
import { getSupportTicketById, updateTicketStatus } from '@/services/support';
import TicketDetailLoading from './loading';

type Status = 'new' | 'seen' | 'resolved';

const getStatusBadge = (status: Status) => {
    switch (status) {
        case 'new': return <Badge variant="destructive">Nouveau</Badge>;
        case 'seen': return <Badge variant="secondary">Vu</Badge>;
        case 'resolved': return <Badge className="bg-green-500/80 text-white hover:bg-green-500">Résolu</Badge>;
        default: return <Badge variant="outline">Inconnu</Badge>;
    }
};

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!ticketId) return;
        async function fetchTicket() {
            setIsLoading(true);
            try {
                const data = await getSupportTicketById(ticketId);
                if (!data) {
                    toast({ variant: 'destructive', title: 'Erreur', description: 'Ticket non trouvé.' });
                    router.push('/auth/support');
                } else {
                    setTicket(data);
                }
            } catch (error) {
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le ticket.' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchTicket();
    }, [ticketId, router, toast]);

    const handleStatusUpdate = async (newStatus: Status) => {
        if (!ticket) return;
        setIsUpdating(true);
        try {
            await updateTicketStatus(ticket.id, newStatus);
            setTicket(prev => prev ? { ...prev, status: newStatus } : null);
            toast({ title: 'Statut mis à jour', className: 'bg-green-500 text-white' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le statut.' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <TicketDetailLoading />;
    }

    if (!ticket) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <Link href="/auth/support" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste des tickets
            </Link>

            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-4">
                                <MessageSquare className="h-6 w-6 mt-1 text-primary"/>
                                <div>
                                    <span className="text-2xl">Ticket de {ticket.userName}</span>
                                    <CardDescription>
                                        Soumis le {format(new Date(ticket.createdAt), "PPP 'à' HH:mm", { locale: fr })}
                                    </CardDescription>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{ticket.message}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Répondre au Ticket</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <Avatar>
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar Admin" data-ai-hint="femme"/>
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="response">Votre réponse</Label>
                                    <Textarea id="response" placeholder="Écrire une réponse à l'utilisateur..." className="min-h-[120px]"/>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button>Envoyer la réponse</Button>
                        </CardFooter>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Détails</CardTitle>
                             {getStatusBadge(ticket.status)}
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                             <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground"/> 
                                <span>{ticket.userName} ({ticket.userRole})</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-muted-foreground"/> 
                                <a href={ticket.pageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{ticket.pageUrl}</a>
                            </div>
                            <Separator />
                             <div className="flex justify-around pt-2">
                                <Button onClick={() => handleStatusUpdate('seen')} disabled={isUpdating || ticket.status === 'seen' || ticket.status === 'resolved'} variant="outline" size="sm">
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Marquer comme Vu
                                </Button>
                                 <Button onClick={() => handleStatusUpdate('resolved')} disabled={isUpdating || ticket.status === 'resolved'} variant="default" size="sm">
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Marquer comme Résolu
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {(ticket.screenshotDataUrl || ticket.audioDataUrls.length > 0) && (
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Pièces Jointes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {ticket.screenshotDataUrl && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><ImageIcon/> Capture d'écran</h4>
                                        <Image src={ticket.screenshotDataUrl} alt="Capture d'écran du problème" width={400} height={225} className="rounded-md border w-full h-auto"/>
                                    </div>
                                )}
                                {ticket.audioDataUrls.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Mic/> Messages Vocaux</h4>
                                        <div className="space-y-2">
                                            {ticket.audioDataUrls.map((audioUrl, index) => (
                                                <audio key={index} src={audioUrl} controls className="w-full h-10"/>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
