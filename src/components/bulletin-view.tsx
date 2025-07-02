
'use client'

import { useEffect, useState } from 'react';
import type { Student, Grade, AcademicTerm } from '@/types';
import { getBulletinDataForStudent, type BulletinData } from '@/services/bulletins';
import { Skeleton } from './ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';

type BulletinViewProps = {
    studentId: string;
    termId: string;
}

const BulletinSkeleton = () => (
    <div className="p-8 border rounded-lg space-y-8">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
            </div>
            <div className="text-right space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-48 ml-auto" />
                <Skeleton className="h-4 w-56 ml-auto" />
            </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
        <div className="space-y-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                </div>
             ))}
        </div>
    </div>
)

export function BulletinView({ studentId, termId }: BulletinViewProps) {
    const [bulletinData, setBulletinData] = useState<BulletinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId || !termId) return;

        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getBulletinDataForStudent(studentId, termId);
                setBulletinData(data);
            } catch (e) {
                console.error(e);
                setError("Impossible de charger les données du bulletin.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [studentId, termId]);

    if (isLoading) return <BulletinSkeleton />;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!bulletinData) return <div className="text-center p-8">Aucune donnée disponible pour ce bulletin.</div>;

    const { student, term, gradesByCourse, courseAverages, overallAverage } = bulletinData;

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-background text-foreground font-serif">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">ScolaGest</h1>
                    <p className="text-muted-foreground">Votre Partenaire Éducatif</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold">Bulletin de Période</h2>
                    <p>Année Scolaire: {new Date(term.startDate).getFullYear()}-{new Date(term.endDate).getFullYear()}</p>
                    <p>Période: {term.name}</p>
                </div>
            </header>

            <Separator className="my-6" />

            <section className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
                <p><strong>Nom de l'élève:</strong> {student.firstName} {student.lastName}</p>
                <p><strong>Classe:</strong> {student.classe} {student.option && `- ${student.option}`}</p>
                <p><strong>Matricule:</strong> {student.matricule}</p>
                <p><strong>Période du:</strong> {new Date(term.startDate).toLocaleDateString('fr-FR')} <strong>au</strong> {new Date(term.endDate).toLocaleDateString('fr-FR')}</p>
            </section>

            <section>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] font-bold">Cours</TableHead>
                            <TableHead className="font-bold text-center">Travaux Journaliers</TableHead>
                            <TableHead className="font-bold text-center">Examen</TableHead>
                            <TableHead className="font-bold text-center">Moy. Période</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(gradesByCourse).map(([course, grades]) => {
                             const tjGrades = grades.filter(g => g.type !== 'Examen');
                             const examGrade = grades.find(g => g.type === 'Examen');
                             return (
                                <TableRow key={course}>
                                    <TableCell className="font-semibold">{course}</TableCell>
                                    <TableCell className="text-center">{tjGrades.map(g => g.grade).join(', ') || '-'}</TableCell>
                                    <TableCell className="text-center">{examGrade?.grade || '-'}</TableCell>
                                    <TableCell className="text-center font-bold">{courseAverages[course] || '-'}</TableCell>
                                </TableRow>
                             )
                        })}
                    </TableBody>
                </Table>
            </section>
            
             <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">Synthèse de la période</h3>
                    <div className="flex justify-between items-center text-lg">
                        <span>Moyenne Générale:</span>
                        <span className="font-bold text-primary">{overallAverage}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm mt-2">
                        <span>Place dans la classe:</span>
                        <span className="font-semibold">N/A</span>
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">Communication du Titulaire</h3>
                     <p className="text-sm text-muted-foreground min-h-[60px]">
                        Les commentaires du professeur titulaire apparaîtront ici.
                    </p>
                </div>
            </section>

            <footer className="mt-12 text-center text-xs text-muted-foreground space-y-4">
                <div className="flex justify-around">
                    <div>
                        <p className="mb-8">Signature du Parent</p>
                        <Separator />
                    </div>
                     <div>
                        <p className="mb-8">Signature du Proviseur</p>
                        <Separator />
                    </div>
                </div>
                <p>Généré par ScolaGest le {new Date().toLocaleDateString('fr-FR')}</p>
            </footer>
        </div>
    );
}
