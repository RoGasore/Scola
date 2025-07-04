
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, MessageSquare, Calendar, Link as LinkIcon, Image as ImageIcon, Mic, Loader2, Send, Shield, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { SupportTicket, TicketMessage } from '@/types';
import { getSupportTicketById, addMessageToTicket, updateTicketStatus } from '@/services/support';
import { sendEmail } from '@/ai/flows/send-email-flow';
import TicketDetailLoading from './loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


const getStatusBadge = (status: SupportTicket['status']) => {
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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    const fetchTicket = useCallback(async () => {
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
    }, [ticketId, router, toast]);

    useEffect(() => {
        if (!ticketId) return;
        fetchTicket();
    }, [ticketId, fetchTicket]);
    
    useEffect(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
      }
    }, [ticket?.conversation]);

    const handleStatusUpdate = async (newStatus: SupportTicket['status']) => {
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
    
    const handleSendResponse = async () => {
        if (!replyMessage.trim() || !ticket) return;
        setIsUpdating(true);
    
        const newMessage: TicketMessage = {
            author: 'admin',
            authorName: 'Support ScolaGest', // In a real app, get admin name from auth
            message: replyMessage,
            createdAt: new Date().toISOString(),
        };
    
        try {
            await addMessageToTicket(ticket.id, newMessage);
            
            setTicket(prev => prev ? {
                ...prev,
                conversation: [...prev.conversation, newMessage],
                status: prev.status === 'resolved' ? 'resolved' : 'seen',
            } : null);
            setReplyMessage('');
    
            await sendEmail({
                to: ticket.userEmail,
                subject: `Re: Votre ticket de support #${ticket.id.substring(0,6)}`,
                html: `
                  <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Réponse à votre ticket de support</h2>
                    <p>Bonjour ${ticket.userName},</p>
                    <p>Un membre de notre équipe a répondu à votre demande de support concernant : <strong>"${ticket.subject}"</strong></p>
                    <hr>
                    <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${replyMessage}</p>
                    <hr>
                    <p>Vous pouvez consulter la conversation complète en vous connectant à votre compte ScolaGest.</p>
                  </div>
                `,
            });
    
            toast({ title: "Réponse envoyée", className: 'bg-green-500 text-white' });
    
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Erreur d'envoi", description: error.message || "Une erreur est survenue." });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <TicketDetailLoading />;
    }

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Ticket non trouvé</h1>
                <p className="text-muted-foreground">Impossible de charger les détails de ce ticket.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/auth/support">
                        <ArrowLeft className="mr-2" />
                        Retour à la liste des tickets
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            <Link href="/auth/support" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste des tickets
            </Link>

            <Card className="flex flex-col h-[calc(100vh-12rem)]">
                <CardHeader className="border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                            <CardTitle className="text-xl break-words">Ticket: {ticket.subject}</CardTitle>
                             <CardDescription>
                                De: {ticket.userName} ({ticket.userRole}) &middot; Reçu {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: fr })}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(ticket.status)}
                             <Button onClick={() => handleStatusUpdate('resolved')} disabled={isUpdating || ticket.status === 'resolved'} variant="outline" size="sm">
                                {isUpdating && ticket.status !== 'resolved' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} Marquer comme Résolu
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1" ref={scrollAreaRef}>
                    <CardContent className="p-4 sm:p-6 space-y-6">
                        {ticket.conversation.map((msg, index) => (
                           <div key={index} className={cn("flex items-end gap-3", msg.author === 'admin' ? 'justify-end' : 'justify-start')}>
                               {msg.author === 'user' && (
                                   <Avatar className="h-8 w-8">
                                       <AvatarFallback><User /></AvatarFallback>
                                   </Avatar>
                               )}
                               <div className={cn(
                                   "max-w-md lg:max-w-xl p-3 rounded-lg space-y-2",
                                   msg.author === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                )}>
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                    
                                    {msg.screenshotDataUrl && (
                                         <Image src={msg.screenshotDataUrl} alt="Capture d'écran du problème" width={400} height={225} className="rounded-md border w-full h-auto cursor-pointer" onClick={() => window.open(msg.screenshotDataUrl)}/>
                                    )}
                                    {msg.audioDataUrls && msg.audioDataUrls.length > 0 && (
                                        <div className="space-y-2 pt-2">
                                            {msg.audioDataUrls.map((audioUrl, audioIndex) => (
                                                <audio key={audioIndex} src={audioUrl} controls className="w-full h-10"/>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs opacity-70 text-right">
                                       {msg.authorName} &middot; {format(new Date(msg.createdAt), 'Pp', { locale: fr })}
                                    </p>
                               </div>
                                {msg.author === 'admin' && (
                                   <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                       <AvatarFallback><Shield /></AvatarFallback>
                                   </Avatar>
                               )}
                           </div>
                        ))}
                    </CardContent>
                </ScrollArea>
                <CardFooter className="border-t p-4">
                    <div className="flex w-full items-start gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback><Shield /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 grid gap-2">
                             <Textarea 
                                placeholder="Écrire une réponse..." 
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendResponse();
                                    }
                                }}
                            />
                             <Button onClick={handleSendResponse} disabled={isUpdating || !replyMessage.trim()} className="w-full sm:w-auto ml-auto">
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Send />} Envoyer
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
