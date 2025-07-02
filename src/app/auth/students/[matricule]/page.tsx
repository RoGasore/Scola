
'use client'

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, User, GraduationCap, CalendarCheck, KeyRound, Eye, EyeOff } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getStudentByMatricule } from '@/services/students';
import type { Student } from '@/types';
import StudentProfileLoading from './loading';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function InfoField({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">{icon} {label}</dt>
            <dd className="text-base font-semibold">{value}</dd>
        </div>
    )
}

export default function StudentProfilePage() {
    const params = useParams();
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const matricule = useMemo(() => {
        if (!params.matricule) return '';
        return decodeURIComponent(params.matricule as string);
    }, [params.matricule]);

    useEffect(() => {
        if (!matricule) {
            setIsLoading(false);
            return;
        };
        
        async function fetchStudent() {
            setIsLoading(true);
            try {
                const studentData = await getStudentByMatricule(matricule);
                setStudent(studentData);
            } catch (error) {
                console.error("Failed to fetch student", error);
                setStudent(null);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchStudent();
    }, [matricule]);
    
    if (isLoading) {
        return <StudentProfileLoading />;
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold">Élève non trouvé</h1>
                <p className="text-muted-foreground">Le matricule "{matricule}" ne correspond à aucun élève.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/auth/students">
                        <ArrowLeft className="mr-2" />
                        Retour à la liste des élèves
                    </Link>
                </Button>
            </div>
        )
    }

    const fullName = `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim();
    const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <Link href="/auth/students" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2" />
                Retour à la liste des élèves
            </Link>

            <Card className="overflow-hidden">
                <CardHeader className="relative p-0 h-32 md:h-48 rounded-t-lg bg-cover bg-center" style={{ backgroundImage: `url(https://placehold.co/1200x400.png)` }} data-ai-hint={student.cover}>
                    <div className="absolute inset-0 bg-black/30" />
                </CardHeader>
                <CardContent className="relative pt-16">
                    <div className="absolute left-6 -top-12">
                        <Avatar className="h-24 w-24 rounded-full border-4 border-background">
                            <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint={student.avatar} alt={fullName} />
                            <AvatarFallback className="text-3xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1 mt-2">
                            <h1 className="text-2xl md:text-3xl font-bold">{fullName}</h1>
                            <p className="text-md text-muted-foreground">{student.classe} {student.option ? `(${student.option})` : ''}</p>
                            <p className="text-sm text-muted-foreground font-mono">{student.matricule}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline"><Mail className="mr-2"/>Contacter</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Modifier le Profil</Button>
                        </div>
                    </div>
                    
                    <Separator className="my-6" />

                    <Tabs defaultValue="info">
                        <TabsList>
                            <TabsTrigger value="info">Informations Générales</TabsTrigger>
                            <TabsTrigger value="grades">Résultats Scolaires</TabsTrigger>
                            <TabsTrigger value="activity">Activité Récente</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="mt-6">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold mb-4">Informations Personnelles</h3>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InfoField icon={<Mail/>} label="Email" value={student.email} />
                                        <InfoField icon={<Phone/>} label="Téléphone" value={student.phone} />
                                        <InfoField icon={<MapPin/>} label="Adresse" value={student.address} />
                                        <InfoField icon={<CalendarCheck/>} label="Date de naissance" value={format(new Date(student.dob), "PPP", { locale: fr })} />
                                        <InfoField icon={<MapPin/>} label="Lieu de naissance" value={student.pob} />
                                        <InfoField icon={<GraduationCap/>} label="Inscrit le" value={format(new Date(student.dateJoined), "PPP", { locale: fr })} />
                                    </dl>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="text-lg font-semibold mb-4">Informations du Tuteur</h3>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                       <InfoField icon={<User/>} label="Nom du parent/tuteur" value={student.parentName} />
                                       <InfoField icon={<Phone/>} label="Téléphone du parent" value={student.parentPhone} />
                                       <InfoField icon={<Mail/>} label="Email du parent" value={student.parentEmail} />
                                    </dl>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="text-lg font-semibold mb-4">Informations de Connexion (Admin)</h3>
                                    <Card className="bg-muted/50 border-primary/20">
                                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoField icon={<User />} label="Matricule (Identifiant)" value={student.matricule} />
                                            <div className="flex flex-col gap-1">
                                                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <KeyRound /> Mot de passe
                                                </dt>
                                                <dd className="flex items-center gap-2">
                                                    <Input readOnly value={passwordVisible ? student.password : '••••••••'} className="font-mono bg-background" />
                                                    <Button variant="ghost" size="icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                                                        <span className="sr-only">Afficher/Masquer le mot de passe</span>
                                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                                    </Button>
                                                </dd>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>
                            </div>
                        </TabsContent>
                        <TabsContent value="grades" className="mt-6">
                             <Card>
                                 <CardHeader>
                                     <CardTitle>Notes et Présences</CardTitle>
                                     <CardDescription>Aperçu des performances scolaires de l'élève.</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Matière</TableHead>
                                                <TableHead>Date Évaluation</TableHead>
                                                <TableHead>Note</TableHead>
                                                <TableHead>% Présence</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow><TableCell>Mathématiques</TableCell><TableCell>2024-05-10</TableCell><TableCell>17/20</TableCell><TableCell>98%</TableCell></TableRow>
                                            <TableRow><TableCell>Français</TableCell><TableCell>2024-05-12</TableCell><TableCell>15/20</TableCell><TableCell>100%</TableCell></TableRow>
                                            <TableRow><TableCell>Physique</TableCell><TableCell>2024-05-15</TableCell><TableCell>14/20</TableCell><TableCell>95%</TableCell></TableRow>
                                        </TableBody>
                                    </Table>
                                 </CardContent>
                             </Card>
                        </TabsContent>
                         <TabsContent value="activity" className="mt-6">
                            <p className="text-muted-foreground">Le fil d'activité de l'élève sera affiché ici.</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
