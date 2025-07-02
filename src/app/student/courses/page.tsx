'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BookOpen, User, MapPin } from 'lucide-react';
import { getCoursesForStudent } from '@/services/courses';
import type { Course, Student } from '@/types';
import StudentCoursesLoading from './loading';
import { getStudentByMatricule, getStudents } from '@/services/students';


export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
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
            const studentCourses = await getCoursesForStudent(studentData.matricule);
            setCourses(studentCourses);
        }
      } catch (error) {
        console.error("Failed to load courses data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <StudentCoursesLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Cours</h1>
        <p className="text-muted-foreground">
          Voici la liste des cours auxquels vous êtes inscrit pour cette année scolaire.
        </p>
      </div>
      
      {courses.length === 0 ? (
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Aucun cours trouvé pour votre classe.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                    <BookOpen className="text-primary mt-1"/>
                    <span>{course.name}</span>
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint="professeur" />
                    <AvatarFallback>{course.professeur.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm flex items-center gap-2"><User /> {course.professeur}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><MapPin /> {course.room}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full">Voir les détails du cours</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
