'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getScheduleForStudent } from '@/services/schedule';
import type { Schedule, Student, ScheduleItem } from '@/types';
import StudentScheduleLoading from './loading';
import { getStudentByMatricule, getStudents } from '@/services/students';
import { Separator } from '@/components/ui/separator';

function ScheduleDay({ items }: { items: ScheduleItem[] }) {
  if (!items || items.length === 0) {
    return (
      <CardContent>
        <p className="text-center text-muted-foreground pt-10">
          Aucun cours prévu pour ce jour.
        </p>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <ul className="space-y-6">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-4 md:gap-6">
            <span className="font-bold text-muted-foreground w-24 md:w-28 text-right">
              {item.time}
            </span>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <p className="font-semibold">{item.course}</p>
              <p className="text-sm text-muted-foreground">
                {item.professeur} &middot; {item.room}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  );
}

export default function StudentSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

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
            const studentSchedule = await getScheduleForStudent(studentData.matricule);
            setSchedule(studentSchedule);
        }
      } catch (error) {
        console.error("Failed to load schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <StudentScheduleLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Horaire</h1>
        <p className="text-muted-foreground">
          Votre emploi du temps pour la semaine en cours.
        </p>
      </div>

       <Tabs defaultValue="Lundi" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {daysOfWeek.map(day => (
            <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
          ))}
        </TabsList>

        {daysOfWeek.map(day => (
            <TabsContent key={day} value={day}>
                <Card>
                    <CardHeader>
                        <CardTitle>Emploi du temps du {day}</CardTitle>
                    </CardHeader>
                    <ScheduleDay items={schedule[day]} />
                </Card>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
