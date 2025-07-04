
'use client'

import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Camera, Mic, Square, Trash2, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendSupportTicket } from '@/ai/flows/send-support-ticket-flow';
import Image from 'next/image';

type SupportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
    const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleScreenshot = async () => {
        try {
            const canvas = await html2canvas(document.body, {
                useCORS: true,
                logging: false,
                onclone: (doc) => {
                    // Find and remove the support dialog from the clone to avoid capturing it
                    const dialog = doc.querySelector('[role="dialog"]');
                    if (dialog) dialog.remove();
                }
            });
            setScreenshotDataUrl(canvas.toDataURL('image/png'));
            toast({ title: "Capture d'écran effectuée" });
        } catch (error) {
            console.error("Error taking screenshot:", error);
            toast({ variant: 'destructive', title: "Erreur de capture", description: "Impossible de prendre la capture d'écran." });
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    setAudioDataUrl(reader.result as string);
                };
                 // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
            toast({ variant: 'destructive', title: "Erreur de micro", description: "Impossible d'accéder au microphone." });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleSubmit = async () => {
        if (!message.trim()) {
            toast({ variant: 'destructive', title: "Message vide", description: "Veuillez décrire votre problème." });
            return;
        }
        setIsSubmitting(true);
        try {
            await sendSupportTicket({
                message,
                screenshotDataUrl: screenshotDataUrl || undefined,
                audioDataUrl: audioDataUrl || undefined,
                pageUrl: window.location.href,
            });
            toast({ title: "Ticket envoyé !", description: "Votre demande de support a été envoyée à l'administrateur.", className: 'bg-green-500 text-white' });
            // Reset state and close
            setMessage('');
            setScreenshotDataUrl(null);
            setAudioDataUrl(null);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to send support ticket:", error);
            toast({ variant: 'destructive', title: "Erreur d'envoi", description: "Une erreur est survenue." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Contacter le Support</DialogTitle>
                    <DialogDescription>
                        Décrivez votre problème. Vous pouvez joindre une capture d'écran et un message vocal.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Votre message</Label>
                        <Textarea 
                            placeholder="Veuillez décrire le problème que vous rencontrez..." 
                            id="message" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={handleScreenshot}>
                            <Camera className="mr-2" /> Joindre une capture d'écran
                        </Button>
                        {!isRecording ? (
                            <Button variant="outline" onClick={startRecording}>
                                <Mic className="mr-2" /> Enregistrer un message vocal
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={stopRecording}>
                                <Square className="mr-2" /> Arrêter l'enregistrement
                            </Button>
                        )}
                    </div>

                    {screenshotDataUrl && (
                        <div className="relative group">
                             <Image src={screenshotDataUrl} alt="Capture d'écran" width={400} height={225} className="rounded-md border"/>
                             <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setScreenshotDataUrl(null)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    )}
                    
                    {audioDataUrl && (
                        <div className="flex items-center gap-2">
                             <audio src={audioDataUrl} controls className="w-full" />
                             <Button variant="destructive" size="icon" onClick={() => setAudioDataUrl(null)}><Trash2/></Button>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                        Envoyer le ticket
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
