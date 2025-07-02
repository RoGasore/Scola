
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { getGradesForStudent } from '@/services/grades';
import { getAcademicTerms } from '@/services/academic';
import type { Grade, Student, AcademicTerm } from '@/types';
import StudentGradesLoading from './loading';
import { getStudentByMatricule, getStudents } from '@/services/students';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BulletinView } from '@/components/bulletin-view';

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
  const [selectedTermId, setSelectedTermId] = useState<string>('');
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
            
            const sortedTerms = academicTerms.sort((a, b) => a.name.localeCompare(b.name));
            setTerms(sortedTerms);
             if (sortedTerms.length > 0) {
                const currentTerm = sortedTerms.find(t => t.isCurrent) || sortedTerms[0];
                setSelectedTermId(currentTerm.id);
            }
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

    if (selectedTermId) {
        const selectedTerm = terms.find(t => t.id === selectedTermId);
        if (selectedTerm) {
            grades = grades.filter(g => g.semester === selectedTerm.semester && g.period === selectedTerm.period);
        }
    }

    if (searchTerm) {
        grades = grades.filter(g => 
            g.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.professeur.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return grades;
  }, [allGrades, selectedTermId, searchTerm, terms]);
  
  const gradesByCourse = useMemo(() => groupBy(filteredGrades, grade => grade.course), [filteredGrades]);
  const overallAverage = useMemo(() => calculateAverage(filteredGrades), [filteredGrades]);

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
                          <p className="text-sm text-muted-foreground">Moyenne de la période</p>
                          <p className="text-2xl font-bold">{overallAverage}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-2 flex-wrap">
                        <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Choisir une période..." /></SelectTrigger>
                            <SelectContent>
                                {terms.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" disabled={!selectedTermId}>
                                    <FileText className="mr-2"/>
                                    Voir mon bulletin
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Bulletin de {student?.firstName}</DialogTitle>
                                    <DialogDescription>
                                        Période: {terms.find(t => t.id === selectedTermId)?.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="h-full overflow-y-auto p-2">
                                    {student && selectedTermId && (
                                        <BulletinView studentId={student.id!} termId={selectedTermId}/>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                   </div>
              </div>
          </CardHeader>
          <CardContent>
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Rechercher un cours, une évaluation..."
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
                            {grades.map(grade => (
                                <TableRow key={grade.id}>
                                    <TableCell><Badge variant="outline">{grade.type}</Badge></TableCell>
                                    <TableCell>{format(new Date(grade.date), 'PPP', { locale: fr })}</TableCell>
                                    <TableCell><Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge></TableCell>
                                    <TableCell>{grade.professeur}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
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
