
'use client'

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Trash2, Send, MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { getRecentAnnouncements } from '@/services/communiques';
import type { Communique } from '@/types';
import CommuniquesLoading from './loading';


function CommuniquePost({ communique }: { communique: Communique }) {
    const [newComment, setNewComment] = useState('');
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint={communique.author.avatar} />
                        <AvatarFallback>{communique.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{communique.author.name}</p>
                        <p className="text-sm text-muted-foreground">{communique.date} &middot; Destinataires: {communique.recipients.join(', ')}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <h2 className="text-xl font-bold">{communique.subject}</h2>
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: communique.content }} 
                />
                {communique.attachments.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Pièces jointes :</h4>
                        <div className="flex flex-col gap-2">
                            {communique.attachments.map((file, i) => (
                                <Button key={i} variant="outline" className="justify-start w-full md:w-auto">
                                    <Paperclip className="mr-2" />
                                    {file.name} ({file.size})
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="py-3 px-6 flex justify-between">
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <ThumbsUp /> <span>Aimer</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <MessageSquare /> <span>{communique.comments.length} Commentaire(s)</span>
                    </Button>
                </div>
                 <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Eye /> <span>{communique.status.read}% Lus</span>
                </Button>
            </CardFooter>
            <Separator />
            <CardContent className="py-4 px-6 space-y-4">
                 {communique.comments.map((comment, index) => (
                    <div key={comment.id} className="flex items-start gap-3">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint={comment.user.avatar} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 text-sm flex-1">
                            <p className="font-semibold">{comment.user.name}</p>
                            <p className="text-muted-foreground">{comment.text}</p>
                        </div>
                    </div>
                ))}
                 <div className="flex items-start gap-3">
                     <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint="femme" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Input 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Écrivez un commentaire..." 
                            className="bg-background"
                        />
                    </div>
                     <Button disabled={!newComment.trim()}>Envoyer</Button>
                 </div>
            </CardContent>
        </Card>
    );
}

export default function CommuniquesPage() {
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [audiences, setAudiences] = useState({ parents: false, eleves: false, professeurs: false });
    const [attachedFiles, setAttachedFiles] = useState<{ name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pastCommuniques, setPastCommuniques] = useState<Communique[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCommuniques() {
            setIsLoading(true);
            const data = await getRecentAnnouncements();
            setPastCommuniques(data);
            setIsLoading(false);
        }
        loadCommuniques();
    }, []);

    const handleAudienceChange = (audience: keyof typeof audiences) => {
        setAudiences(prev => ({ ...prev, [audience]: !prev[audience] }));
    };

    const handleSend = () => {
        const isMessageEmpty = !message || message.replace(/<[^>]*>?/gm, '').trim().length === 0;

        if (isMessageEmpty || !subject.trim()) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Le sujet et le message ne peuvent pas être vides.' });
            return;
        }
        const selectedAudiences = Object.entries(audiences)
            .filter(([, isSelected]) => isSelected)
            .map(([key]) => key);

        if (selectedAudiences.length === 0) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner au moins un destinataire.' });
            return;
        }

        console.log('Sending message:', message, 'to', selectedAudiences, 'with files:', attachedFiles);
        toast({
            title: 'Communiqué envoyé !',
            description: `Votre message a bien été envoyé à : ${selectedAudiences.join(', ')}.`,
            className: "bg-green-500 text-white",
        });
        setMessage('');
        setSubject('');
        setAudiences({ parents: false, eleves: false, professeurs: false });
        setAttachedFiles([]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).map(file => ({ name: file.name }));
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nouveau Communiqué</CardTitle>
                    <CardDescription>Rédigez et envoyez une nouvelle communication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Input 
                        placeholder="Sujet de votre communiqué"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <RichTextEditor
                        content={message}
                        onChange={setMessage}
                        placeholder="Écrivez votre message ici..."
                    />
                    <div className="space-y-2">
                        {attachedFiles.length > 0 && (
                            <div className="space-y-2 border p-2 rounded-md">
                                {attachedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm p-1 bg-muted rounded-md">
                                        <span className="truncate pr-2">{file.name}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(file.name)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                         <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Paperclip className="mr-2" />
                            Joindre des fichiers
                        </Button>
                        <Input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="grid gap-3">
                      <Label>Destinataires</Label>
                      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-parents" checked={audiences.parents} onCheckedChange={() => handleAudienceChange('parents')} />
                              <Label htmlFor="dest-parents" className="cursor-pointer">Parents</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-eleves" checked={audiences.eleves} onCheckedChange={() => handleAudienceChange('eleves')} />
                              <Label htmlFor="dest-eleves" className="cursor-pointer">Élèves</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-professeurs" checked={audiences.professeurs} onCheckedChange={() => handleAudienceChange('professeurs')} />
                              <Label htmlFor="dest-professeurs" className="cursor-pointer">Professeurs</Label>
                          </div>
                      </div>
                  </div>
                </CardContent>
                <CardFooter>
                     <Button className="w-full md:w-auto ml-auto bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSend}>
                        <Send className="mr-2" />
                        Envoyer le Communiqué
                    </Button>
                </CardFooter>
            </Card>

            <Separator />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Fil d'actualité</h2>
                 {isLoading ? (
                    <CommuniquesLoading />
                ) : (
                    pastCommuniques.map(communique => (
                        <CommuniquePost key={communique.id} communique={communique} />
                    ))
                )}
            </div>
        </div>
    );
}
