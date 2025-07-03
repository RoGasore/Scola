
'use client'

import { useEffect, useState } from 'react';
import type { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getStudentById } from '@/services/students';
import { Skeleton } from '../ui/skeleton';


type MaternelleBulletinViewProps = {
    studentId: string;
    termId: string;
};

const MaternelleBulletinSkeleton = () => (
     <div className="bg-white text-black font-sans p-4" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
        <Card className="h-full">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-5 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
            </CardContent>
        </Card>
    </div>
);


export function MaternelleBulletinView({ studentId, termId }: MaternelleBulletinViewProps) {
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;
        setIsLoading(true);
        getStudentById(studentId)
            .then(data => setStudent(data))
            .finally(() => setIsLoading(false));
    }, [studentId]);

    if (isLoading) {
        return <MaternelleBulletinSkeleton />;
    }
    
    if (!student) {
        return <div>Élève non trouvé.</div>;
    }
    
    return (
        <div className="bg-white text-black font-sans p-4" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Bulletin de la Maternelle</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">Élève: {student.firstName} {student.lastName}</p>
                    <p className="text-muted-foreground mt-4">
                        Le modèle de bulletin pour le niveau Maternelle n'est pas encore implémenté.
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Veuillez fournir le design et la structure des données pour ce bulletin.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
