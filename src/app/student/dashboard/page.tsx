
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Clock, BarChart, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useEffect, useState } from 'react';
import type { Student, Communique } from '@/types';
import { getStudentByMatricule, getStudents } from '@/services/students';
import { getRecentAnnouncements } from '@/services/communiques';
import StudentDashboardLoading from './loading';


const upcomingAssignments = [
    { title: "Dissertation de Français", course: "Français", dueDate: "25 Juillet 2024" },
    { title: "Exercices de Physique - Chapitre 3", course: "Physique", dueDate: "28 Juillet 2024" },
    { title: "Exposé d'Histoire", course: "Histoire", dueDate: "02 Août 2024" },
];

const recentGrades = [
    { course: "Mathématiques", grade: "17/20", type: "Interrogation" },
    { course: "Biologie", grade: "14/20", type: "Examen" },
    { course: "Anglais", grade: "18/20", type: "Devoir" },
];

const scheduleToday = [
    { time: "08:00 - 09:50", course: "Mathématiques", teacher: "M. Dupont", room: "Salle 101" },
    { time: "10:00 - 11:50", course: "Physique", teacher: "Mme. Curie", room: "Labo 02" },
    { time: "12:00 - 12:50", course: "Gymnastique", teacher: "M. Armstrong", room: "Gymnase" },
];

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [announcements, setAnnouncements] = useState<Communique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
        setIsLoading(true);
        try {
            // In a real app with authentication, you'd get the current user's matricule.
            // For now, we try a default one, and if not found, we take the first student in the DB.
            let studentData = await getStudentByMatricule('E24-M1-001');

            if (!studentData) {
                const allStudents = await getStudents();
                if (allStudents.length > 0) {
                    studentData = allStudents[0];
                }
            }
            
            const announcementsData = await getRecentAnnouncements();
            setStudent(studentData);
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            // In a real app, you might set an error state here
        } finally {
            setIsLoading(false);
        }
    }
    loadDashboardData();
  }, []);

  if (isLoading) {
      return <StudentDashboardLoading />;
  }

  if (!student) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bienvenue sur votre Espace Élève</CardTitle>
                <CardDescription>Profil élève non trouvé.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Il semble qu'aucun profil élève n'ait encore été créé dans la base de données.</p>
                <p className="text-muted-foreground text-sm mt-2">Un administrateur doit d'abord inscrire des élèves pour que leurs tableaux de bord soient accessibles.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Retour à la page de connexion</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  const studentName = student.firstName;

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, {studentName} !</h1>
                <p className="text-muted-foreground">Voici un résumé de votre journée et de vos activités scolaires.</p>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">16.5/20</div>
                    <p className="text-xs text-muted-foreground">+1.2 depuis le dernier trimestre</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Taux de Présence</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">Aucune absence ce mois-ci</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Devoirs à Rendre</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Dont 1 pour demain</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Horaire du Jour</CardTitle>
                    <CardDescription>Mercredi 24 Juillet 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {scheduleToday.map((item, index) => (
                             <li key={index} className="flex items-center gap-4">
                                <span className="font-semibold text-muted-foreground w-28">{item.time}</span>
                                <Separator orientation="vertical" className="h-8"/>
                                <div>
                                    <p className="font-bold">{item.course}</p>
                                    <p className="text-sm text-muted-foreground">{item.teacher} &middot; {item.room}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Devoirs à Venir</CardTitle>
                    <CardDescription>N'oubliez pas de rendre vos travaux à temps.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-4">
                        {upcomingAssignments.map((assignment, index) => (
                             <li key={index} className="flex flex-col gap-1">
                                <p className="font-semibold">{assignment.title}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <Badge variant="outline">{assignment.course}</Badge>
                                    <span className="text-muted-foreground">{assignment.dueDate}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">Voir tous les devoirs</Button>
                </CardFooter>
            </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle>Notes Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {recentGrades.map((grade, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{grade.course}</p>
                                    <p className="text-sm text-muted-foreground">{grade.type}</p>
                                </div>
                                <Badge variant="secondary" className="text-base">{grade.grade}</Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">Voir le bulletin complet</Button>
                </CardFooter>
            </Card>
             <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Communiqués Récents</CardTitle>
                    <CardDescription>Les dernières informations de l'école.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-4">
                        {announcements.map((communique) => (
                            <li key={communique.id}>
                                <Link href="#" className="flex items-center gap-4 p-2 -m-2 rounded-lg hover:bg-muted">
                                    <Avatar className="h-10 w-10 border">
                                         <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint={communique.author.avatar} />
                                         <AvatarFallback>{communique.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold leading-tight">{communique.subject}</p>
                                        <p className="text-sm text-muted-foreground">{communique.author.name} &middot; {communique.time}</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </Link>
                            </li>
                        ))}
                   </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
