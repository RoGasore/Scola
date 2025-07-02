
'use client'

import { useEffect, useState } from 'react';
import type { Student } from '@/types';
import { getStudentById } from '@/services/students';
import { Skeleton } from './ui/skeleton';
import { SecondaireBulletinView } from './bulletins/SecondaireBulletinView';
import { PrimaireBulletinView } from './bulletins/PrimaireBulletinView';
import { MaternelleBulletinView } from './bulletins/MaternelleBulletinView';

type BulletinViewProps = {
    studentId: string;
    termId: string;
}

const BulletinRouterSkeleton = () => (
     <div className="p-4 border rounded-lg space-y-6 bg-white">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
     </div>
);

export function BulletinView({ studentId, termId }: BulletinViewProps) {
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId || !termId) return;

        async function fetchStudentData() {
            setIsLoading(true);
            setError(null);
            try {
                const studentData = await getStudentById(studentId);
                if (!studentData) {
                    throw new Error("Student not found");
                }
                setStudent(studentData);
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Impossible de charger les données de l'élève.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchStudentData();
    }, [studentId, termId]);

    if (isLoading) return <BulletinRouterSkeleton />;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!student) return <div className="text-center p-8">Élève non trouvé.</div>;

    // Dynamically render the correct bulletin based on the student's level
    switch (student.level) {
        case 'Secondaire':
            return <SecondaireBulletinView studentId={studentId} termId={termId} />;
        case 'Primaire':
            return <PrimaireBulletinView student={student} termId={termId} />;
        case 'Maternelle':
            return <MaternelleBulletinView student={student} termId={termId} />;
        default:
            return <div className="text-center p-8">Type de bulletin non pris en charge pour ce niveau.</div>;
    }
}

    