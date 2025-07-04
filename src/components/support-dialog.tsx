
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Camera, Mic, Square, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendSupportTicket } from '@/ai/flows/send-support-ticket-flow';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';

type SupportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
      name: string;
      role: string;
    };
};

export function SupportDialog({ open, onOpenChange, user }: SupportDialogProps) {
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
    const [audioDataUrls, setAudioDataUrls] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const cleanup = useCallback(() => {
        stopRecording();
        setMessage('');
        setScreenshotDataUrl(null);
        setAudioDataUrls([]);
        setRecordingTime(0);
    }, [stopRecording]);

    useEffect(() => {
        if (!open) {
            cleanup();
        }
        // Cleanup on component unmount
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [open, cleanup]);

    const handleScreenshot = async () => {
        try {
            const canvas = await html2canvas(document.body, {
                useCORS: true,
                logging: false,
                onclone: (doc) => {
                    const dialogs = doc.querySelectorAll('[role="dialog"]');
                    dialogs.forEach(dialog => dialog.remove());
                    const fab = doc.querySelector('.fixed.bottom-6.right-6');
                    if (fab) fab.remove();
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
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    setAudioDataUrls(prev => [...prev, reader.result as string]);
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Error starting recording:", error);
            toast({ variant: 'destructive', title: "Erreur de micro", description: "Impossible d'accéder au microphone." });
        }
    };

    const handleSubmit = async () => {
        let finalMessage = message.trim();
        if (finalMessage === '' && audioDataUrls.length > 0) {
            finalMessage = "J'ai envoyé un message vocal pour exprimer mon souci. Veuillez l'écouter.";
        }

        if (finalMessage === '' && audioDataUrls.length === 0) {
            toast({ variant: 'destructive', title: "Ticket vide", description: "Veuillez décrire votre problème ou enregistrer un message vocal." });
            return;
        }
        
        setIsSubmitting(true);
        try {
            await sendSupportTicket({
                message: finalMessage,
                screenshotDataUrl: screenshotDataUrl || undefined,
                audioDataUrls: audioDataUrls,
                pageUrl: window.location.href,
                userName: user.name,
                userRole: user.role,
            });
            toast({ title: "Ticket envoyé !", description: "Votre demande de support a été envoyée à l'administrateur.", className: 'bg-green-500 text-white' });
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
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Contacter le Support</DialogTitle>
                    <DialogDescription>
                        Décrivez votre problème. Vous pouvez joindre une capture d'écran et des messages vocaux.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 py-4">
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
                                <div className="flex items-center gap-2 p-2 rounded-md border border-destructive w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="font-mono text-sm text-destructive">{formatTime(recordingTime)}</span>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={stopRecording}>
                                        <Square className="mr-2" /> Arrêter
                                    </Button>
                                </div>
                            )}
                        </div>

                        {screenshotDataUrl && (
                            <div className="relative group">
                                <p className="text-sm font-medium mb-1">Capture d'écran :</p>
                                <Image src={screenshotDataUrl} alt="Capture d'écran" width={400} height={225} className="rounded-md border"/>
                                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setScreenshotDataUrl(null)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        )}
                        
                        {audioDataUrls.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Messages vocaux :</p>
                                {audioDataUrls.map((audioUrl, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <audio src={audioUrl} controls className="w-full h-10" />
                                        <Button variant="ghost" size="icon" onClick={() => setAudioDataUrls(urls => urls.filter((_, i) => i !== index))}><Trash2 className="text-destructive h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter className="px-6 pb-6">
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
