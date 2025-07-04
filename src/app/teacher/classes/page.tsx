
'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Presentation, BookOpen, Users, AlertTriangle } from 'lucide-react';
import TeacherClassesLoading from './loading';
import { getTeacherAssignments, type TeacherAssignment } from '@/services/teachers';
import { getStudentsByClass } from '@/services/students';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AssignmentWithStudentCount = TeacherAssignment & { studentCount: number };

export default function TeacherClassesPage() {
    const [assignments, setAssignments] = useState<AssignmentWithStudentCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            setError(null);
            try {
                // In a real app, teacherName would come from auth session
                const teacherAssignments = await getTeacherAssignments('M. Dupont');
                
                if (teacherAssignments.length === 0) {
                    setAssignments([]);
                } else {
                    const assignmentsWithCounts = await Promise.all(
                        teacherAssignments.map(async (assignment) => {
                            const students = await getStudentsByClass(assignment.class);
                            return { ...assignment, studentCount: students.length };
                        })
                    );
                    setAssignments(assignmentsWithCounts);
                }
            } catch (err) {
                console.error("Failed to load teacher assignments:", err);
                setError("Une erreur est survenue lors du chargement de vos classes.");
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return <TeacherClassesLoading />;
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <p className="text-sm text-muted-foreground mt-2">Veuillez réessayer plus tard ou contacter le support si le problème persiste.</p>
                </CardContent>
            </Card>
        );
    }

    if (assignments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Aucune Classe Assignée</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Il semble que vous ne soyez affecté à aucune classe pour le moment.</p>
                    <p className="text-sm text-muted-foreground mt-2">Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administration.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mes Classes</h1>
                <p className="text-muted-foreground">
                    Voici un aperçu des classes et des cours qui vous sont assignés.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <Card key={assignment.class} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Presentation /> {assignment.class}</CardTitle>
                            <CardDescription className="flex items-center gap-2"><Users /> {assignment.studentCount} élèves</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <h4 className="font-semibold flex items-center gap-2 text-sm"><BookOpen /> Cours enseignés :</h4>
                            <div className="flex flex-wrap gap-2">
                                {assignment.courses.map(course => (
                                    <Badge key={course} variant="secondary">{course}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/teacher/notes">Saisir une note pour cette classe</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
