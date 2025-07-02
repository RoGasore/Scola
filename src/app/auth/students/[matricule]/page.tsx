
'use client'

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, User, GraduationCap, CalendarCheck, TrendingUp, KeyRound, Eye, EyeOff } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

// NOTE: In a real app, this data would be fetched from a database
const allStudents = [
  { matricule: 'E23-M1-001', name: 'Alice Petit', email: 'alice.p@example.com', phone: '+243 81 111 1111', address: '1 Av. des Mimosas, Limete', level: 'Maternelle', classe: '1ère Maternelle', section: null, option: null, status: 'Actif', dateJoined: '2023-09-01', dob: '2020-05-10', pob: 'Kinshasa', parentName: 'Hélène Petit', parentPhone: '+243 99 111 1111', avatar: 'fille congolaise', cover: 'ecole jeux', password: 'abc123' },
  { matricule: 'E22-M2-001', name: 'Léo Dubois', email: 'leo.d@example.com', phone: '+243 81 222 2222', address: '22 Av. du Commerce, Gombe', level: 'Maternelle', classe: '2ème Maternelle', section: null, option: null, status: 'Actif', dateJoined: '2022-09-01', dob: '2019-03-15', pob: 'Lubumbashi', parentName: 'Thomas Dubois', parentPhone: '+243 99 222 2222', avatar: 'garçon congolais', cover: 'salle de classe', password: 'def456' },
  { matricule: 'E21-M3-001', name: 'Clara Roy', email: 'clara.r@example.com', phone: '+243 81 333 3333', address: '3 Blvd du 30 Juin, Gombe', level: 'Maternelle', classe: '3ème Maternelle', section: null, option: null, status: 'Actif', dateJoined: '2021-09-01', dob: '2018-07-20', pob: 'Kinshasa', parentName: 'Sophie Roy', parentPhone: '+243 99 333 3333', avatar: 'fille congolaise', cover: 'bibliotheque scolaire', password: 'ghi789' },
  { matricule: 'E23-P1-001', name: 'Chloé Bernard', email: 'chloe.b@example.com', phone: '+243 81 444 4444', address: '4 Rue de la Paix, Kintambo', level: 'Primaire', classe: '1ère Primaire', section: null, option: null, status: 'Actif', dateJoined: '2023-09-02', dob: '2017-01-25', pob: 'Goma', parentName: 'Luc Bernard', parentPhone: '+243 99 444 4444', avatar: 'fille congolaise', cover: 'cour de recreation', password: 'jkl012' },
  { matricule: 'E18-P6-001', name: 'Hugo Martin', email: 'hugo.m@example.com', phone: '+243 81 555 5555', address: '55 Av. de l\'Université, Lemba', level: 'Primaire', classe: '6ème Primaire', section: null, option: null, status: 'Inactif', dateJoined: '2018-09-02', dob: '2012-11-30', pob: 'Kinshasa', parentName: 'Nathalie Martin', parentPhone: '+243 99 555 5555', avatar: 'garçon congolais', cover: 'terrain de sport', password: 'mno345' },
  { matricule: 'E20-P4-001', name: 'Emma Simon', email: 'emma.s@example.com', phone: '+243 81 666 6666', address: '6 Av. de la Montagne, Ngaliema', level: 'Primaire', classe: '4ème Primaire', section: null, option: null, status: 'Actif', dateJoined: '2020-09-02', dob: '2014-09-12', pob: 'Kisangani', parentName: 'David Simon', parentPhone: '+243 99 666 6666', avatar: 'fille congolaise', cover: 'artisanat enfant', password: 'pqr678' },
  { matricule: 'E23-S7B-001', name: 'Manon Lefebvre', email: 'manon.l@example.com', phone: '+243 81 777 7777', address: '7 Q. Joli Parc, Ngaliema', level: 'Secondaire', classe: '7ème Année', section: 'Éducation de base', option: null, status: 'Actif', dateJoined: '2023-09-05', dob: '2011-04-01', pob: 'Kinshasa', parentName: 'Sylvie Lefebvre', parentPhone: '+243 99 777 7777', avatar: 'femme congolaise', cover: 'salle de science', password: 'stu901' },
  { matricule: 'E22-S8B-001', name: 'Lucas Moreau', email: 'lucas.m@example.com', phone: '+243 81 888 8888', address: '8 Av. des Okapis, Gombe', level: 'Secondaire', classe: '8ème Année', section: 'Éducation de base', option: null, status: 'Actif', dateJoined: '2022-09-05', dob: '2010-02-18', pob: 'Matadi', parentName: 'Paul Moreau', parentPhone: '+243 99 888 8888', avatar: 'homme congolais', cover: 'livres etudes', password: 'vwx234' },
  { matricule: 'E21-SLG1-001', name: 'Jade Garcia', email: 'jade.g@example.com', phone: '+243 81 999 9999', address: '9 Av. de la Libération, Lingwala', level: 'Secondaire', classe: '1ère Latin-Grec', section: 'Humanités', option: 'Latin-Grec', status: 'Actif', dateJoined: '2021-09-05', dob: '2009-08-08', pob: 'Kinshasa', parentName: 'Isabelle Garcia', parentPhone: '+243 99 999 9999', avatar: 'femme congolaise', cover: 'etudiant ordinateur', password: 'yzab567' },
  { matricule: 'E20-SSE2-001', name: 'Louis Roux', email: 'louis.r@example.com', phone: '+243 81 101 0101', address: '10 Av. du Port, Gombe', level: 'Secondaire', classe: '2ème Sciences Économiques', section: 'Humanités', option: 'Sciences Économiques', status: 'Actif', dateJoined: '2020-09-05', dob: '2008-06-21', pob: 'Boma', parentName: 'François Roux', parentPhone: '+243 99 101 0101', avatar: 'homme congolais', cover: 'tableau chiffres', password: 'cde890' },
  { matricule: 'E20-SEL2-001', name: 'Emma Laurent', email: 'emma.l@example.com', phone: '+243 81 121 2121', address: '11 Q. Salongo, Lemba', level: 'Secondaire', classe: '2ème Électricité', section: 'Humanités', option: 'Électricité', status: 'Inactif', dateJoined: '2020-09-05', dob: '2008-10-10', pob: 'Kinshasa', parentName: 'Valérie Laurent', parentPhone: '+243 99 121 2121', avatar: 'femme congolaise', cover: 'circuit electronique', password: 'fgh123' },
  { matricule: 'E19-SBC3-001', name: 'Arthur Lemoine', email: 'arthur.l@example.com', phone: '+243 81 131 3131', address: '12 Av. de la Démocratie, Kasa-Vubu', level: 'Secondaire', classe: '3ème Biochimie', section: 'Humanités', option: 'Biochimie', status: 'Actif', dateJoined: '2019-09-05', dob: '2007-12-05', pob: 'Kananga', parentName: 'Benoît Lemoine', parentPhone: '+243 99 131 3131', avatar: 'homme congolais', cover: 'laboratoire chimie', password: 'ijk456' },
  { matricule: 'E24-SEL4-001', name: 'Mohamed Cissé', email: 'mohamed.c@example.com', phone: '+243 81 141 4141', address: '14 Av. de l\'Avenir, Bandalungwa', level: 'Secondaire', classe: '4ème Électricité', section: 'Humanités', option: 'Électricité', status: 'En attente', dateJoined: '2024-08-01', dob: '2006-02-28', pob: 'Dakar', parentName: 'Awa Cissé', parentPhone: '+243 99 141 4141', avatar: 'homme africain', cover: 'ordinateur code', password: 'lmn789' },
];


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
    const [passwordVisible, setPasswordVisible] = useState(false);

    const matricule = useMemo(() => {
        if (!params.matricule) return '';
        return decodeURIComponent(params.matricule as string);
    }, [params.matricule]);

    const student = useMemo(() => allStudents.find(s => s.matricule === matricule), [matricule]);

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
                            <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint={student.avatar} alt={student.name} />
                            <AvatarFallback className="text-3xl">
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1 mt-2">
                            <h1 className="text-2xl md:text-3xl font-bold">{student.name}</h1>
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
                                        <InfoField icon={<CalendarCheck/>} label="Date de naissance" value={student.dob} />
                                        <InfoField icon={<MapPin/>} label="Lieu de naissance" value={student.pob} />
                                        <InfoField icon={<GraduationCap/>} label="Inscrit le" value={student.dateJoined} />
                                    </dl>
                                </section>
                                <Separator />
                                <section>
                                    <h3 className="text-lg font-semibold mb-4">Informations du Tuteur</h3>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                       <InfoField icon={<User/>} label="Nom du parent/tuteur" value={student.parentName} />
                                       <InfoField icon={<Phone/>} label="Téléphone du parent" value={student.parentPhone} />
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
