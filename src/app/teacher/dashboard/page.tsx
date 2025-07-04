
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookCopy, Users, CalendarClock, MessageSquarePlus, Presentation } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Bonjour, M. Dupont</h1>
            <p className="text-muted-foreground">Bienvenue sur votre espace enseignant. Voici un aperçu de vos activités.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Classes Assignées</CardTitle>
                    <Presentation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">incluant 2 classes de 4ème année</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nombre total d'élèves</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">85</div>
                    <p className="text-xs text-muted-foreground">répartis dans vos classes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prochaine Évaluation</CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold">Interro de Math</div>
                    <p className="text-xs text-muted-foreground">4ème - Le 28/07/2024</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Accès Rapides</CardTitle>
                <CardDescription>Effectuez vos tâches les plus courantes en un clic.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                 <Button asChild>
                    <Link href="/teacher/notes">
                        <BookCopy />
                        Saisir une nouvelle évaluation
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/teacher/classes">
                        <Presentation />
                        Voir mes classes
                    </Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/teacher/communiques">
                        <MessageSquarePlus />
                        Publier un communiqué
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
