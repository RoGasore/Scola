'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getGradesForStudent } from '@/services/grades';
import type { Grade, Student } from '@/types';
import StudentGradesLoading from './loading';
import { getStudentByMatricule, getStudents } from '@/services/students';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        let studentData = await getStudentByMatricule('E24-M1-001');
        if (!studentData) {
            const allStudents = await getStudents();
            if (allStudents.length > 0) studentData = allStudents[0];
        }

        if (studentData) {
            setStudent(studentData);
            const studentGrades = await getGradesForStudent(studentData.matricule);
            setGrades(studentGrades);
        }
      } catch (error) {
        console.error("Failed to load grades data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getGradeColor = (gradeValue: string): string => {
    const numericGrade = parseInt(gradeValue.split('/')[0]);
    if (isNaN(numericGrade)) return 'bg-gray-500/80 text-white';

    if (numericGrade >= 15) return 'bg-green-500/80 text-white';
    if (numericGrade >= 10) return 'bg-yellow-500/80 text-black';
    return 'bg-red-500/80 text-white';
  };

  if (isLoading) {
    return <StudentGradesLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Notes</h1>
        <p className="text-muted-foreground">
          Consultez vos résultats pour toutes les évaluations.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Bulletin de notes - Année en cours</CardTitle>
          <CardDescription>
            Voici la liste détaillée de toutes les notes que vous avez obtenues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead>Type d'évaluation</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Professeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.course}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{grade.type}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(grade.date), "PPP", { locale: fr })}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{grade.professeur}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Aucune note n'a encore été publiée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
