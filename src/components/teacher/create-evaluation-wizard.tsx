
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2, ArrowRight, ArrowLeft, Check, Save } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Student, Grade } from '@/types';
import { getTeacherAssignments } from '@/services/teachers';
import { getStudentsByClass } from '@/services/students';
import { getCurrentAcademicTerm } from '@/services/academic';
import { addGradesBatch } from '@/services/grades';
import { Skeleton } from '../ui/skeleton';

type Assignment = {
    class: string;
    courses: string[];
}

const evaluationDetailsSchema = z.object({
  assignment: z.object({
    class: z.string({ required_error: "La classe est requise." }),
    course: z.string({ required_error: "Le cours est requis." }),
  }),
  evaluationDate: z.date({ required_error: "La date de l'évaluation est requise." }),
  evaluationType: z.string().min(1, "Le type d'évaluation est requis."),
  customEvaluationType: z.string().optional(),
  ponderation: z.number({ required_error: "La pondération est requise." }).min(1, "La pondération doit être au moins de 1."),
  description: z.string().optional(),
}).refine(data => {
    if (data.evaluationType === 'custom') {
        return !!data.customEvaluationType && data.customEvaluationType.length > 0;
    }
    return true;
}, {
    message: "Veuillez spécifier le type personnalisé.",
    path: ["customEvaluationType"],
});

type EvaluationDetails = z.infer<typeof evaluationDetailsSchema>;
type StudentGrade = { student: Student, score: number | null };

const cardVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const getGradeColor = (score: number, ponderation: number) => {
    const percentage = (score / ponderation) * 100;
    if (percentage < 50) return 'bg-red-500/80 text-white';
    if (percentage < 70) return 'bg-yellow-500/80 text-black';
    return 'bg-green-500/80 text-white';
}

export function CreateEvaluationWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [evaluationDetails, setEvaluationDetails] = useState<EvaluationDetails | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  
  const form = useForm<EvaluationDetails>({
    resolver: zodResolver(evaluationDetailsSchema),
    defaultValues: {
      description: "",
      ponderation: 20
    }
  });

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      // In a real app, you'd get the logged-in teacher's name/ID.
      // We'll use "M. Dupont" as a mock teacher who has assignments in our data.
      const teacherAssignments = await getTeacherAssignments('M. Dupont');
      setAssignments(teacherAssignments);
      setIsLoading(false);
    }
    fetchInitialData();
  }, []);
  
  const selectedClass = form.watch("assignment.class");

  const availableCourses = useMemo(() => {
    if (!selectedClass) return [];
    const assignment = assignments.find(a => a.class === selectedClass);
    return assignment?.courses || [];
  }, [selectedClass, assignments]);
  
  const handleDetailsSubmit = async (data: EvaluationDetails) => {
    setEvaluationDetails(data);
    setIsLoading(true);
    const fetchedStudents = await getStudentsByClass(data.assignment.class);

    if (fetchedStudents.length === 0) {
      toast({
        variant: "destructive",
        title: "Aucun élève trouvé",
        description: `Il n'y a aucun élève inscrit dans la classe ${data.assignment.class}.`
      });
      setIsLoading(false);
      return;
    }

    setStudents(fetchedStudents);
    setGrades(fetchedStudents.map(s => ({ student: s, score: null })));
    setIsLoading(false);
    setStep(2);
  };
  
  const handleGradeSubmit = (score: number) => {
    const newGrades = [...grades];
    newGrades[currentStudentIndex].score = score;
    setGrades(newGrades);

    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    } else {
      setStep(3);
    }
  };

  const handleFinalSubmit = async () => {
    if (!evaluationDetails || grades.some(g => g.score === null)) {
      toast({ variant: 'destructive', title: "Erreur", description: "Toutes les notes doivent être saisies." });
      return;
    }
    setIsSubmitting(true);
    
    try {
        const currentTerm = await getCurrentAcademicTerm();
        if (!currentTerm) {
            throw new Error("Impossible de trouver la période académique actuelle. Veuillez en définir une dans les paramètres.");
        }

        const finalGrades: Omit<Grade, 'id'>[] = grades.map(g => {
            const finalEvaluationType = evaluationDetails.evaluationType === 'custom'
                ? evaluationDetails.customEvaluationType!
                : evaluationDetails.evaluationType;
            
            return {
                studentId: g.student.id,
                studentMatricule: g.student.matricule,
                class: evaluationDetails.assignment.class,
                course: evaluationDetails.assignment.course,
                professeur: "M. Dupont", // Mock teacher name for now
                evaluationType: finalEvaluationType,
                evaluationDate: evaluationDetails.evaluationDate.toISOString(),
                ponderation: evaluationDetails.ponderation,
                score: g.score!,
                submissionDate: new Date().toISOString(),
                termId: currentTerm.id,
                semester: currentTerm.semester,
                period: currentTerm.period,
            };
        });

        await addGradesBatch(finalGrades);
        
        toast({ title: "Succès", description: "Les notes ont été enregistrées avec succès.", className: "bg-green-500 text-white" });
        setStep(4); // Go to a final success screen

    } catch (error: any) {
         toast({ variant: 'destructive', title: "Échec de l'enregistrement", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };


  const renderStep = () => {
    if (isLoading) {
       return <CardContent><div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div></CardContent>;
    }

    switch (step) {
      case 1:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDetailsSubmit)}>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="assignment.class" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); form.setValue('assignment.course', ''); }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner la classe" /></SelectTrigger></FormControl>
                        <SelectContent>{assignments.map(a => <SelectItem key={a.class} value={a.class}>{a.class}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="assignment.course" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cours</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedClass}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le cours" /></SelectTrigger></FormControl>
                        <SelectContent>{availableCourses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="evaluationDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de l'évaluation</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("w-full md:w-1/2 justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2" />{field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="evaluationType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'évaluation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Interrogation">Interrogation</SelectItem>
                            <SelectItem value="Examen">Examen</SelectItem>
                            <SelectItem value="Devoir à domicile">Devoir à domicile</SelectItem>
                            <SelectItem value="Devoir en classe">Devoir en classe</SelectItem>
                            <SelectItem value="Travaux Pratiques">Travaux Pratiques (TP)</SelectItem>
                            <SelectItem value="Pratique">Pratique</SelectItem>
                            <SelectItem value="custom">Autre (Personnalisé)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {form.watch('evaluationType') === 'custom' && (
                        <FormField control={form.control} name="customEvaluationType" render={({ field }) => (
                           <FormItem><FormLabel>Type personnalisé</FormLabel><FormControl><Input placeholder="Ex: Projet de fin de semestre" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                  </div>
                 <FormField control={form.control} name="ponderation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pondération (Note maximale)</FormLabel>
                      <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl><Textarea placeholder="Courte description sur le contenu de l'évaluation..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                    Suivant <ArrowRight className="ml-2"/>
                </Button>
              </CardFooter>
            </form>
          </Form>
        );
      
      case 2:
        if (!students.length || !students[currentStudentIndex]) {
          return (
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 h-48">
              <p className="text-muted-foreground">Aucun élève à noter ou erreur de chargement.</p>
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2"/>Retour</Button>
            </CardContent>
          );
        }

        const StudentGradingCard = ({ student, ponderation, onGradeSubmit }: { student: Student, ponderation: number, onGradeSubmit: (score: number) => void }) => {
            const [score, setScore] = useState('');
            const [error, setError] = useState('');

            const validateAndSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                setError('');
                const scoreNum = parseFloat(score);
                if (isNaN(scoreNum)) {
                    setError("Veuillez entrer un nombre valide.");
                    return;
                }
                if (scoreNum < 0 || scoreNum > ponderation) {
                    setError(`La note doit être entre 0 et ${ponderation}.`);
                    return;
                }
                onGradeSubmit(scoreNum);
            }

            return (
                <form onSubmit={validateAndSubmit}>
                    <CardContent className='flex flex-col items-center gap-4'>
                        <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
                        <p className="text-muted-foreground font-mono">{student.matricule}</p>
                        <div className="flex items-baseline gap-2">
                             <Input 
                                type="text" // Use text to allow decimal input easily
                                inputMode="decimal" // Hint for mobile keyboards
                                className="text-2xl font-bold h-12 w-32 text-center" 
                                placeholder="Note"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                autoFocus
                            />
                            <span className="text-2xl font-semibold text-muted-foreground">/ {ponderation}</span>
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                        <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2"/>Retour</Button>
                        <Button type="submit">Valider et Suivant <ArrowRight className="ml-2"/></Button>
                    </CardFooter>
                </form>
            );
          }

        return (
             <div className="overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStudentIndex}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center px-6 pb-4">
                            <h2 className="text-lg font-semibold">{evaluationDetails?.assignment.course} - {evaluationDetails?.assignment.class}</h2>
                            <p className="text-sm text-muted-foreground">Élève {currentStudentIndex + 1} sur {students.length}</p>
                        </div>
                        <Separator className='mb-6' />
                        <StudentGradingCard 
                            student={students[currentStudentIndex]} 
                            ponderation={evaluationDetails!.ponderation}
                            onGradeSubmit={handleGradeSubmit}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    
    case 3:
      return (
        <div>
            <CardContent>
                 <h2 className="text-lg font-semibold text-center mb-1">{evaluationDetails?.assignment.course} - {evaluationDetails?.assignment.class}</h2>
                 <p className="text-sm text-muted-foreground text-center mb-4">Résumé des notes saisies</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Élève</TableHead>
                            <TableHead className="text-right">Note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.map(({ student, score }) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={getGradeColor(score!, evaluationDetails!.ponderation)}>
                                        {score} / {evaluationDetails!.ponderation}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                 <Button type="button" variant="outline" onClick={() => { setCurrentStudentIndex(students.length - 1); setStep(2); }}><ArrowLeft className="mr-2"/>Modifier</Button>
                <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Save className="mr-2"/>}
                    Enregistrer et Terminer
                </Button>
            </CardFooter>
        </div>
      );
    case 4:
        return (
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 h-64">
                <Check className="h-16 w-16 text-green-500 bg-green-500/10 p-2 rounded-full"/>
                <h2 className="text-2xl font-bold">Évaluation Enregistrée !</h2>
                <p className="text-muted-foreground">Les notes ont été ajoutées avec succès au dossier des élèves.</p>
                <Button onClick={() => { setStep(1); form.reset();}}>Saisir une autre évaluation</Button>
            </CardContent>
        )
      default:
        return null;
    }
  }

  return <div>{renderStep()}</div>;
}
