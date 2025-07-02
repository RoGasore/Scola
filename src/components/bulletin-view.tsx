
'use client'

import { useEffect, useState } from 'react';
import type { Student, BulletinData } from '@/types';
import { getBulletinDataForStudent } from '@/services/bulletins';
import { getStudentById } from '@/services/students';
import { Skeleton } from './ui/skeleton';
import { SecondaireBulletinView } from './bulletins/SecondaireBulletinView';
import { PrimaireBulletinView } from './bulletins/PrimaireBulletinView';
import { MaternelleBulletinView } from './bulletins/MaternelleBulletinView';

type BulletinViewProps = {
    studentId: string;
    termId: string;
}

const BulletinSkeleton = () => (
    <div className="p-4 border rounded-lg space-y-6 bg-white">
        <div className="flex justify-between items-start">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
        </div>
        <div className="text-center">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
        </div>
        <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/4" />
                </div>
            ))}
        </div>
    </div>
);

export function BulletinView({ studentId, termId }: BulletinViewProps) {
    const [student, setStudent] = useState<Student | null>(null);
    const [bulletinData, setBulletinData] = useState<BulletinData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!studentId || !termId) return;

        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const studentData = await getStudentById(studentId);
                if (!studentData) {
                    throw new Error("Student not found");
                }
                setStudent(studentData);

                // Fetch bulletin data only if the student is found
                const data = await getBulletinDataForStudent(studentId, termId);
                setBulletinData(data);
                
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Impossible de charger les données du bulletin.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [studentId, termId]);

    if (isLoading) return <BulletinSkeleton />;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!student) return <div className="text-center p-8">Élève non trouvé.</div>;

    // Dynamically render the correct bulletin based on the student's level
    switch (student.level) {
        case 'Secondaire':
            if (!bulletinData) return <div className="text-center p-8">Aucune donnée de bulletin disponible pour ce niveau.</div>;
            return <SecondaireBulletinView bulletinData={bulletinData} />;
        case 'Primaire':
            return <PrimaireBulletinView student={student} termId={termId} />;
        case 'Maternelle':
            return <MaternelleBulletinView student={student} termId={termId} />;
        default:
            return <div className="text-center p-8">Type de bulletin non pris en charge pour ce niveau.</div>;
    }
}
