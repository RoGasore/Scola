
'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Loader2, CheckCircle } from 'lucide-react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { AcademicTerm, Student } from '@/types';
import { getAcademicTerms, addAcademicTerm, setCurrentTerm } from '@/services/academic';
import SettingsLoading from './loading';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulletinView } from '@/components/bulletin-view';
import { getStudents } from '@/services/students';


export default function SettingsPage() {
    const [terms, setTerms] = useState<AcademicTerm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const { toast } = useToast();

    // State for bulletin previews
    const [previewStudentIds, setPreviewStudentIds] = useState<{ [level: string]: string }>({});
    const [currentTermId, setCurrentTermId] = useState<string | null>(null);

    // State for the new term form
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newSemester, setNewSemester] = useState<number | undefined>();
    const [newPeriod, setNewPeriod] = useState<number | undefined>();
    const [newStartDate, setNewStartDate] = useState<Date | undefined>();
    const [newEndDate, setNewEndDate] = useState<Date | undefined>();

    async function fetchData() {
        setIsLoading(true);
        try {
            const [termsData, studentsData] = await Promise.all([
                getAcademicTerms(),
                getStudents()
            ]);
            
            setTerms(termsData);

            const currentTerm = termsData.find(t => t.isCurrent) || termsData[0];
            if (currentTerm) {
                setCurrentTermId(currentTerm.id);
            }
            
            const studentIds: { [level: string]: string } = {};
            const maternelleStudent = studentsData.find(s => s.level === 'Maternelle');
            const primaireStudent = studentsData.find(s => s.level === 'Primaire');
            const secondaireStudent = studentsData.find(s => s.level === 'Secondaire');

            if (maternelleStudent) studentIds['Maternelle'] = maternelleStudent.id;
            if (primaireStudent) studentIds['Primaire'] = primaireStudent.id;
            if (secondaireStudent) studentIds['Secondaire'] = secondaireStudent.id;
            
            setPreviewStudentIds(studentIds);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Erreur de chargement",
                description: "Impossible de charger les données pour les paramètres."
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetCurrent = async (termId: string) => {
        setIsUpdating(termId);
        try {
            await setCurrentTerm(termId);
            toast({
                title: "Période mise à jour",
                description: "La nouvelle période actuelle a été définie avec succès.",
                className: "bg-green-500 text-white",
            });
            await fetchData();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Erreur",
                description: "Impossible de définir la période actuelle."
            });
        } finally {
            setIsUpdating(null);
        }
    }

    const handleAddTerm = async () => {
        if (!newName || !newSemester || !newPeriod || !newStartDate || !newEndDate) {
            toast({ variant: 'destructive', title: "Champs requis", description: "Veuillez remplir tous les champs du formulaire." });
            return;
        }
        setIsSubmitting(true);
        try {
            await addAcademicTerm({
                name: newName,
                semester: newSemester,
                period: newPeriod,
                startDate: newStartDate.toISOString(),
                endDate: newEndDate.toISOString(),
                isCurrent: false,
            });
            toast({ title: "Période ajoutée", description: "La nouvelle période a été créée avec succès.", className: "bg-green-500 text-white" });
            setDialogOpen(false);
            resetForm();
            await fetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible d'ajouter la nouvelle période." });
        } finally {
            setIsSubmitting(false);
        }
    }

    const resetForm = () => {
        setNewName('');
        setNewSemester(undefined);
        setNewPeriod(undefined);
        setNewStartDate(undefined);
        setNewEndDate(undefined);
    }

    if (isLoading) {
        return <SettingsLoading />;
    }

    const renderBulletinPreview = (level: 'Maternelle' | 'Primaire' | 'Secondaire') => {
        const studentId = previewStudentIds[level];
        if (studentId && currentTermId) {
            return (
                <div className="mt-4 p-4 border rounded-lg bg-muted/20 max-h-[800px] overflow-auto">
                    <BulletinView studentId={studentId} termId={currentTermId} />
                </div>
            );
        }
        return (
            <div className="mt-4 p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
                <p>Aucun élève de niveau "{level}" trouvé pour générer un aperçu.</p>
                <p className="text-sm">Veuillez d'abord inscrire un élève de ce niveau.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">Gérez les configurations globales de l'application.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <div>
                            <CardTitle>Périodes Académiques</CardTitle>
                            <CardDescription>Définissez les semestres et périodes de l'année scolaire.</CardDescription>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2" /> Ajouter une Période</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Nouvelle Période Académique</DialogTitle>
                                    <DialogDescription>
                                        Créez une nouvelle période pour l'année scolaire.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Nom</Label>
                                        <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: 1ère Période" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="semester" className="text-right">Semestre</Label>
                                        <Select onValueChange={(v) => setNewSemester(Number(v))}><SelectTrigger className="col-span-3"><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="1">1er Semestre</SelectItem><SelectItem value="2">2ème Semestre</SelectItem><SelectItem value="3">3ème Semestre</SelectItem></SelectContent></Select>
                                    </div>
                                     <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="period" className="text-right">Période</Label>
                                        <Select onValueChange={(v) => setNewPeriod(Number(v))}><SelectTrigger className="col-span-3"><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent>{[1,2,3,4,5,6].map(p=><SelectItem key={p} value={String(p)}>Période {p}</SelectItem>)}</SelectContent></Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="start-date" className="text-right">Date de début</Label>
                                        <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal col-span-3", !newStartDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newStartDate ? format(newStartDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newStartDate} onSelect={setNewStartDate} initialFocus /></PopoverContent></Popover>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="end-date" className="text-right">Date de fin</Label>
                                        <Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal col-span-3", !newEndDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newEndDate ? format(newEndDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newEndDate} onSelect={setNewEndDate} initialFocus /></PopoverContent></Popover>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddTerm} disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Début</TableHead>
                                <TableHead>Fin</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {terms.length > 0 ? terms.map(term => (
                                <TableRow key={term.id}>
                                    <TableCell className="font-medium">{term.name}</TableCell>
                                    <TableCell>{format(new Date(term.startDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{format(new Date(term.endDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        {term.isCurrent ? (
                                            <Badge className="bg-green-500/80 text-white">Actuelle</Badge>
                                        ) : (
                                            <Badge variant="outline">Archivée</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleSetCurrent(term.id)} 
                                            disabled={term.isCurrent || isUpdating === term.id}
                                        >
                                            {isUpdating === term.id && <Loader2 className="mr-2 animate-spin" />}
                                            {term.isCurrent && <CheckCircle className="mr-2" />}
                                            {term.isCurrent ? "Période Actuelle" : "Définir comme actuelle"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">Aucune période académique définie.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Modèles de Bulletins</CardTitle>
                    <CardDescription>
                        Prévisualisez l'apparence des bulletins pour chaque niveau d'enseignement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="Secondaire" className="w-full">
                        <TabsList>
                            <TabsTrigger value="Secondaire">Secondaire</TabsTrigger>
                            <TabsTrigger value="Primaire">Primaire</TabsTrigger>
                            <TabsTrigger value="Maternelle">Maternelle</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Secondaire">
                            {renderBulletinPreview('Secondaire')}
                        </TabsContent>
                        <TabsContent value="Primaire">
                            {renderBulletinPreview('Primaire')}
                        </TabsContent>
                        <TabsContent value="Maternelle">
                            {renderBulletinPreview('Maternelle')}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

        </div>
    );
}
