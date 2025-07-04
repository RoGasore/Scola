
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, Link as LinkIcon, Image as ImageIcon, Mic, Loader2, Send, Shield, AlertTriangle, Square, Trash2, Check, CheckCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/rich-text-editor';
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
    
    // Reply state
    const [replyMessage, setReplyMessage] = useState('');
    const [audioDataUrls, setAudioDataUrls] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        setIsRecording(false);
    }, []);
    
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => setAudioDataUrls(prev => [...prev, reader.result as string]);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerIntervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur de micro", description: "Impossible d'accéder au microphone." });
        }
    };


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
        return () => stopRecording();
    }, [ticketId, fetchTicket, stopRecording]);
    
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
        const isMessageEmpty = !replyMessage || replyMessage.replace(/<[^>]*>?/gm, '').trim().length === 0;
        if (isMessageEmpty && audioDataUrls.length === 0) {
            toast({ variant: "destructive", title: "Réponse vide", description: "Veuillez écrire un message ou enregistrer un audio." });
            return;
        }

        if (!ticket || !ticket.userEmail) {
            toast({ variant: 'destructive', title: "Erreur de données", description: "Impossible de trouver l'adresse e-mail du destinataire pour ce ticket." });
            return;
        }

        setIsUpdating(true);
    
        const newMessage: TicketMessage = {
            author: 'admin',
            authorName: 'Support ScolaGest',
            message: replyMessage,
            createdAt: new Date().toISOString(),
            audioDataUrls: audioDataUrls,
            status: 'sent',
        };
    
        try {
            await addMessageToTicket(ticket.id, newMessage);
            
            const originalSubject = ticket.subject || `Ticket #${ticket.id.substring(0, 6)}`;
            await sendEmail({
                to: ticket.userEmail,
                subject: `Re: Votre ticket de support (${originalSubject})`,
                html: `
                  <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Réponse à votre ticket de support</h2>
                    <p>Bonjour ${ticket.userName || 'Utilisateur'},</p>
                    <p>Un membre de notre équipe a répondu à votre demande de support concernant : <strong>"${originalSubject}"</strong></p>
                    <hr>
                    ${replyMessage}
                    <hr>
                    <p>Vous pouvez consulter la conversation complète en vous connectant à votre compte ScolaGest.</p>
                  </div>
                `,
            });
    
            setTicket(prev => prev ? {
                ...prev,
                conversation: [...(prev.conversation || []), newMessage],
                status: prev.status === 'resolved' ? 'resolved' : 'seen',
            } : null);
            setReplyMessage('');
            setAudioDataUrls([]);
            toast({ title: "Réponse envoyée", className: 'bg-green-500 text-white' });
    
        } catch (error: any) {
            toast({ variant: "destructive", title: "Erreur d'envoi", description: error.message || "Une erreur est survenue." });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <TicketDetailLoading />;

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Ticket non trouvé</h1>
                <p className="text-muted-foreground">Impossible de charger les détails de ce ticket.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/auth/support"><ArrowLeft className="mr-2" />Retour à la liste</Link>
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
                        {(ticket.conversation || []).map((msg, index) => (
                           <div key={index} className={cn("flex items-end gap-3", msg.author === 'admin' ? 'justify-end' : 'justify-start')}>
                               {msg.author === 'user' && (
                                   <Avatar className="h-8 w-8"><AvatarFallback><User /></AvatarFallback></Avatar>
                               )}
                               <div className={cn( "max-w-md lg:max-w-xl p-3 rounded-lg space-y-2", msg.author === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-current" dangerouslySetInnerHTML={{ __html: msg.message }} />
                                    
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

                                    <div className={cn("flex items-center gap-1.5 text-xs opacity-70", msg.author === 'admin' ? 'justify-end' : 'justify-start')}>
                                       <span>{msg.authorName} &middot; {format(new Date(msg.createdAt), 'p', { locale: fr })}</span>
                                       {msg.author === 'admin' && (
                                          msg.status === 'read' ? <CheckCheck className="h-4 w-4 text-sky-400" /> : <Check className="h-4 w-4" />
                                       )}
                                    </div>
                               </div>
                                {msg.author === 'admin' && (
                                   <Avatar className="h-8 w-8 bg-primary text-primary-foreground"><AvatarFallback><Shield /></AvatarFallback></Avatar>
                               )}
                           </div>
                        ))}
                    </CardContent>
                </ScrollArea>
                <CardFooter className="border-t p-2 sm:p-4">
                    <div className="flex-1 grid gap-2">
                         <RichTextEditor content={replyMessage} onChange={setReplyMessage} placeholder="Écrire une réponse..." />
                         <div className="flex items-center justify-between gap-2">
                            <div className='flex gap-2'>
                                {!isRecording ? (
                                    <Button variant="ghost" size="icon" onClick={startRecording}><Mic/></Button>
                                ) : (
                                     <div className="flex items-center gap-2 p-2 rounded-md border border-destructive">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="font-mono text-sm text-destructive">{formatTime(recordingTime)}</span>
                                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={stopRecording}><Square className="h-4 w-4" /></Button>
                                    </div>
                                )}
                                 {audioDataUrls.length > 0 && (
                                    <div className="flex gap-2 items-center">
                                        {audioDataUrls.map((audioUrl, index) => (
                                            <div key={index} className="flex items-center gap-1 p-1 rounded-full bg-muted">
                                                <audio src={audioUrl} controls className="h-8 max-w-[150px]"/>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAudioDataUrls(urls => urls.filter((_, i) => i !== index))}><Trash2 className="text-destructive h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleSendResponse} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Send />}<span className="hidden sm:inline ml-2">Envoyer</span>
                            </Button>
                         </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
