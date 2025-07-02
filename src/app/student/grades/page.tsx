
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp } from 'lucide-react';

import { getGradesForStudent } from '@/services/grades';
import { getAcademicTerms } from '@/services/academic';
import type { Grade, Student, AcademicTerm } from '@/types';
import StudentGradesLoading from './loading';
import { getStudentByMatricule, getStudents } from '@/services/students';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Helper function to calculate average, handling various grade formats
const calculateAverage = (grades: Grade[]): string => {
    let total = 0;
    let count = 0;
    grades.forEach(g => {
        const match = g.grade.match(/(\d+(\.\d+)?)\s*\/\s*(\d+)/);
        if (match) {
            const score = parseFloat(match[1]);
            const max = parseInt(match[3], 10);
            if (!isNaN(score) && !isNaN(max) && max > 0) {
                total += (score / max) * 20; // Normalize to 20
                count++;
            }
        }
    });
    if (count === 0) return 'N/A';
    return `${(total / count).toFixed(2)}/20`;
};

// Helper function to group items by a key
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);


export default function StudentGradesPage() {
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
            const [studentGrades, academicTerms] = await Promise.all([
                getGradesForStudent(studentData.matricule),
                getAcademicTerms()
            ]);
            setAllGrades(studentGrades);
            setTerms(academicTerms.sort((a,b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error("Failed to load grades data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredGrades = useMemo(() => {
    let grades = allGrades;

    if (selectedSemester !== 'all') {
      grades = grades.filter(g => g.semester === parseInt(selectedSemester));
    }
    if (selectedPeriod !== 'all') {
      grades = grades.filter(g => g.period === parseInt(selectedPeriod));
    }
    if (searchTerm) {
        grades = grades.filter(g => 
            g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.professeur.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return grades;
  }, [allGrades, selectedSemester, selectedPeriod, searchTerm]);
  
  const gradesByCourse = useMemo(() => groupBy(filteredGrades, grade => grade.course), [filteredGrades]);
  const overallAverage = useMemo(() => calculateAverage(filteredGrades), [filteredGrades]);

  const getGradeColor = (gradeValue: string): string => {
    const numericGrade = parseInt(gradeValue.split('/')[0]);
    if (isNaN(numericGrade)) return 'bg-gray-500/80 text-white';

    if (numericGrade >= 15) return 'bg-green-500/80 text-white';
    if (numericGrade >= 10) return 'bg-yellow-500/80 text-black';
    return 'bg-red-500/80 text-white';
  };
  
  const availablePeriods = useMemo(() => {
      if (selectedSemester === 'all') return terms;
      return terms.filter(t => t.semester === parseInt(selectedSemester));
  }, [terms, selectedSemester]);

  if (isLoading) {
    return <StudentGradesLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Notes</h1>
        <p className="text-muted-foreground">
          Consultez vos résultats, suivez votre progression et analysez vos performances.
        </p>
      </div>
      
      <Card>
          <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                          <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                          <p className="text-2xl font-bold">{overallAverage}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-2 flex-wrap">
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Semestre" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Tous les semestres</SelectItem><SelectItem value="1">1er Semestre</SelectItem><SelectItem value="2">2ème Semestre</SelectItem></SelectContent>
                        </Select>
                         <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Période" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Toutes les périodes</SelectItem>{availablePeriods.map(p => <SelectItem key={p.id} value={String(p.period)}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                   </div>
              </div>
          </CardHeader>
          <CardContent>
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Rechercher un cours, une évaluation, un prof..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(gradesByCourse).length > 0 ? Object.entries(gradesByCourse).map(([course, grades]) => {
            const courseAverage = calculateAverage(grades);
            const gradesByPeriod = groupBy(grades, g => g.period);

            return (
                <AccordionItem key={course} value={course} className="border-b-0">
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                          <h3 className="text-lg font-semibold">{course}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Moyenne</span>
                            <Badge variant="secondary" className="text-lg">{courseAverage}</Badge>
                          </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                         {Object.entries(gradesByPeriod).map(([period, periodGrades]) => {
                             const term = terms.find(t => t.period === Number(period));
                             return (
                                <div key={period}>
                                    <h4 className="font-semibold mb-2">{term?.name || `Période ${period}`}</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Note</TableHead>
                                                <TableHead>Professeur</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {periodGrades.map(grade => (
                                            <TableRow key={grade.id}>
                                                <TableCell><Badge variant="outline">{grade.type}</Badge></TableCell>
                                                <TableCell>{format(new Date(grade.date), 'PPP', { locale: fr })}</TableCell>
                                                <TableCell><Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge></TableCell>
                                                <TableCell>{grade.professeur}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </div>
                             )
                         })}
                      </div>
                    </AccordionContent>
                   </Card>
                </AccordionItem>
            )
        }) : (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Aucun résultat trouvé pour les filtres sélectionnés.</p>
                </CardContent>
            </Card>
        )}
      </Accordion>
    </div>
  );
}
