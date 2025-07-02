
'use client'

import type { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type PrimaireBulletinViewProps = {
    student: Student;
    termId: string;
};

export function PrimaireBulletinView({ student, termId }: PrimaireBulletinViewProps) {
    // This is a placeholder component.
    // The actual implementation will require a specific data structure and design for this level,
    // especially considering the 3-semester/6-period structure.
    
    return (
        <div className="bg-white text-black font-sans p-4" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Bulletin du Primaire</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">Élève: {student.firstName} {student.lastName}</p>
                     <p className="text-muted-foreground mt-4">
                        Le modèle de bulletin pour le niveau Primaire n'est pas encore implémenté.
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Il faudra notamment adapter le système pour gérer les 3 semestres et 6 périodes.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
