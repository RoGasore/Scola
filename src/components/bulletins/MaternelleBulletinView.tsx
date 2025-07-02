
'use client'

import type { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type MaternelleBulletinViewProps = {
    student: Student;
    termId: string;
};

export function MaternelleBulletinView({ student, termId }: MaternelleBulletinViewProps) {
    // This is a placeholder component.
    // The actual implementation will require a specific data structure and design for this level.
    
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
