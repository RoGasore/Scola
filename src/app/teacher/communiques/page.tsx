
'use client'

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/rich-text-editor';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';
import { getTeacherAssignments, type TeacherAssignment } from '@/services/teachers';
import TeacherCommuniquesLoading from './loading';

export default function TeacherCommuniquesPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                // In a real app, teacherName would come from auth session
                const teacherAssignments = await getTeacherAssignments('M. Dupont');
                setAssignments(teacherAssignments);
            } catch (err) {
                console.error("Failed to load teacher assignments:", err);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger vos classes.' });
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [toast]);

    const handleClassChange = (className: string) => {
        setSelectedClasses(prev => 
            prev.includes(className) 
                ? prev.filter(c => c !== className)
                : [...prev, className]
        );
    };

    const handleSend = () => {
        const isMessageEmpty = !message || message.replace(/<[^>]*>?/gm, '').trim().length === 0;

        if (isMessageEmpty || !subject.trim()) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Le sujet et le message ne peuvent pas être vides.' });
            return;
        }

        if (selectedClasses.length === 0) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner au moins une classe destinataire.' });
            return;
        }

        console.log('Sending message:', message, 'to classes:', selectedClasses);
        toast({
            title: 'Communiqué envoyé !',
            description: `Votre message a bien été envoyé aux élèves et parents des classes : ${selectedClasses.join(', ')}.`,
            className: "bg-green-500 text-white",
        });

        setMessage('');
        setSubject('');
        setSelectedClasses([]);
    };

    if (isLoading) {
        return <TeacherCommuniquesLoading />;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nouveau Communiqué</CardTitle>
                    <CardDescription>Rédigez une communication pour vos classes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Input 
                        placeholder="Sujet de votre communiqué"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <div className="grid gap-3">
                      <Label>Destinataires (Parents et Élèves)</Label>
                        {assignments.length > 0 ? (
                           <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                                {assignments.map(assignment => (
                                    <div key={assignment.class} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`dest-${assignment.class}`} 
                                            checked={selectedClasses.includes(assignment.class)}
                                            onCheckedChange={() => handleClassChange(assignment.class)}
                                        />
                                        <Label htmlFor={`dest-${assignment.class}`} className="cursor-pointer">{assignment.class}</Label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Vous n'avez aucune classe assignée pour envoyer un communiqué.</p>
                        )}
                    </div>
                    
                    <RichTextEditor
                        content={message}
                        onChange={setMessage}
                        placeholder="Écrivez votre message ici..."
                    />
                </CardContent>
                <CardFooter>
                     <Button className="w-full md:w-auto ml-auto" onClick={handleSend} disabled={assignments.length === 0}>
                        <Send className="mr-2" />
                        Envoyer
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
