import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Clock, BarChart, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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

const recentAnnouncements = [
    { id: 'COM001', author: { name: 'Direction Scolaire', avatar: 'school building' }, subject: "Rappel : Réunion Parents-Professeurs", time: "il y a 2 jours" },
    { id: 'COM002', author: { name: 'M. Dupont (Prof. de Sport)', avatar: 'homme noir' }, subject: "Information : Journée sportive annuelle", time: "il y a 10 jours" },
];

export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, Léo !</h1>
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
                        {recentAnnouncements.map((communique) => (
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
