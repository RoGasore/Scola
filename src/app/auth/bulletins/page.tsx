
'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Folder, Users, User, ChevronRight, FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getLevels, getClassesForLevel, getSectionsForSecondary, getOptionsForHumanites } from '@/lib/school-data';
import { getStudents } from '@/services/students';
import type { Student } from '@/types';
import BulletinsLoading from './loading';
import { useToast } from '@/hooks/use-toast';
import { BulletinView } from '@/components/bulletin-view';
import { getAcademicTerms } from '@/services/academic';

// A generic component for navigating through the hierarchy
const ExplorerItem = ({ title, onClick, icon: Icon, description }: { title: string, onClick: () => void, icon: React.ElementType, description?: string }) => (
    <div onClick={onClick} className="group relative block cursor-pointer">
        <Card className="group-hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            {description && <CardContent><p className="text-xs text-muted-foreground">{description}</p></CardContent>}
        </Card>
    </div>
);


export default function BulletinsPage() {
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [selectedTermId, setSelectedTermId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();

    // State for hierarchical navigation
    const [path, setPath] = useState<string[]>([]); // e.g., ['Primaire', '1ère Primaire']
    const [studentsInView, setStudentsInView] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

    const bulletinRef = useRef<HTMLDivElement>(null);

    // Initial data fetch
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [studentsFromDb, academicTerms] = await Promise.all([getStudents(), getAcademicTerms()]);
                setAllStudents(studentsFromDb);
                const sortedTerms = academicTerms.sort((a, b) => a.name.localeCompare(b.name));
                setTerms(sortedTerms);
                if (sortedTerms.length > 0) {
                    const currentTerm = sortedTerms.find(t => t.isCurrent) || sortedTerms[0];
                    setSelectedTermId(currentTerm.id);
                }
            } catch (err) {
                toast({ variant: 'destructive', title: "Erreur", description: "Impossible de charger les données." });
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [toast]);

    // Update students in view and selection when path changes
    useEffect(() => {
        let currentStudents = allStudents;
        const [level, item1, item2, item3] = path;

        if (level) currentStudents = allStudents.filter(s => s.level === level);
        if (level === 'Secondaire') {
            if (item1) currentStudents = currentStudents.filter(s => s.section === item1);
            if (item2) currentStudents = currentStudents.filter(s => s.option === item2);
            if (item3) currentStudents = currentStudents.filter(s => s.classe === item3);
        } else {
            if (item1) currentStudents = currentStudents.filter(s => s.classe === item1);
        }

        setStudentsInView(currentStudents);
        setSelectedStudents(new Set(currentStudents.map(s => s.id!)));
    }, [path, allStudents]);

    const handleExportZip = async (studentsToExport: Student[]) => {
        if (!selectedTermId) {
            toast({ variant: 'destructive', title: 'Aucune période sélectionnée', description: 'Veuillez sélectionner une période pour l\'export.' });
            return;
        }
        if (studentsToExport.length === 0) {
             toast({ variant: 'destructive', title: 'Aucun élève sélectionné', description: 'Veuillez sélectionner au moins un élève.' });
            return;
        }
        setIsExporting(true);
        toast({ title: 'Démarrage de l\'exportation', description: `Préparation de ${studentsToExport.length} bulletin(s)...` });

        const zip = new JSZip();
        const term = terms.find(t => t.id === selectedTermId);
        if (!term) {
            setIsExporting(false);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Période sélectionnée invalide.' });
            return;
        };

        // The logic for PDF generation is a placeholder.
        // In a real implementation, we would use html2canvas on the BulletinView component.
        // For now, we generate a simple text-based PDF.
        for (const student of studentsToExport) {
            const pdf = new jsPDF();
            pdf.text(`Bulletin de ${student.firstName} ${student.lastName}`, 10, 10);
            pdf.text(`Classe: ${student.classe}`, 10, 20);
            pdf.text(`Période: ${term.name}`, 10, 30);
            // This is a placeholder for the actual bulletin content
            pdf.text("Contenu du bulletin à implémenter.", 10, 40);
            const pdfBlob = pdf.output('blob');
            
            let pathPrefix = '';
            if (student.level === 'Primaire' || student.level === 'Maternelle') {
                pathPrefix = `${student.level}/${student.classe}/`;
            } else if (student.level === 'Secondaire') {
                pathPrefix = `${student.level}/${student.section || ''}/${student.option || ''}/${student.classe}/`.replace(/\/+/g, '/');
            }
            
            zip.file(`${pathPrefix}Bulletin_${student.lastName}_${student.firstName}.pdf`, pdfBlob);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipName = path.length > 0 ? path.join('_') : 'Tous_les_bulletins';
        saveAs(zipBlob, `Bulletins_${zipName}_${term.name}.zip`);

        setIsExporting(false);
        toast({ title: 'Exportation terminée', description: 'Le fichier ZIP a été téléchargé.', className: 'bg-green-500 text-white' });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudents(new Set(studentsInView.map(s => s.id!)));
        } else {
            setSelectedStudents(new Set());
        }
    };
    
    const handleSelectStudent = (studentId: string, checked: boolean) => {
        const newSet = new Set(selectedStudents);
        if (checked) {
            newSet.add(studentId);
        } else {
            newSet.delete(studentId);
        }
        setSelectedStudents(newSet);
    };

    const renderContent = () => {
        const [level, item1, item2] = path;

        if (path.length === 0) {
            const levels = getLevels();
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map(l => <ExplorerItem key={l} title={l} icon={Folder} onClick={() => setPath([l])} />)}
                </div>
            );
        }
        
        if (level && path.length === 1) {
            if (level === 'Maternelle' || level === 'Primaire') {
                const classes = getClassesForLevel(level);
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map(c => <ExplorerItem key={c} title={c} icon={Users} onClick={() => setPath([level, c])} />)}
                    </div>
                )
            }
             if (level === 'Secondaire') {
                const sections = getSectionsForSecondary();
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sections.map(s => <ExplorerItem key={s} title={s} icon={Folder} onClick={() => setPath([level, s])} />)}
                    </div>
                )
            }
        }

        if (level === 'Secondaire' && item1 && path.length === 2) {
             if (item1 === 'Éducation de base') {
                const classes = getClassesForLevel(level, item1);
                 return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map(c => <ExplorerItem key={c} title={c} icon={Users} onClick={() => setPath([level, item1, c])} />)}
                    </div>
                )
             }
              if (item1 === 'Humanités') {
                const options = getOptionsForHumanites();
                 return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {options.map(o => <ExplorerItem key={o} title={o} icon={Folder} onClick={() => setPath([level, item1, o])} />)}
                    </div>
                )
             }
        }

        if (level === 'Secondaire' && item1 === 'Humanités' && item2 && path.length === 3) {
            const classes = getClassesForLevel(level, item1, item2);
             return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map(c => <ExplorerItem key={c} title={c} icon={Users} onClick={() => setPath([level, item1, item2, c])} />)}
                </div>
            )
        }
        
        // Default to student list view if path is deep enough
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                             <Checkbox 
                                checked={selectedStudents.size > 0 && selectedStudents.size === studentsInView.length}
                                onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                aria-label="Tout sélectionner"
                            />
                        </TableHead>
                        <TableHead>Élève</TableHead>
                        <TableHead className="hidden sm:table-cell">Matricule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentsInView.length > 0 ? (
                        studentsInView.map((student) => (
                            <TableRow key={student.matricule}>
                                <TableCell>
                                    <Checkbox 
                                        checked={selectedStudents.has(student.id!)}
                                        onCheckedChange={(checked) => handleSelectStudent(student.id!, Boolean(checked))}
                                        aria-label={`Sélectionner ${student.firstName} ${student.lastName}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{student.matricule}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={!selectedTermId}><FileText className="mr-2 h-4 w-4" />Voir</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl h-[90vh]">
                                            <DialogHeader>
                                                <DialogTitle>Bulletin de {student.firstName} {student.lastName}</DialogTitle>
                                                <DialogDescription>Période: {terms.find(t => t.id === selectedTermId)?.name}</DialogDescription>
                                            </DialogHeader>
                                            <div className="h-full overflow-y-auto p-2" ref={bulletinRef}>
                                                <BulletinView studentId={student.id!} termId={selectedTermId} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={4} className="h-24 text-center">Aucun élève trouvé dans cette section.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        );
    };

    const studentsToExport = useMemo(() => {
        return allStudents.filter(s => selectedStudents.has(s.id!))
    }, [selectedStudents, allStudents]);

    const getHeaderTitle = () => {
        if (path.length === 0) return "Explorer les Bulletins";
        return path[path.length - 1];
    }

    if (isLoading) {
        return <BulletinsLoading />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Bulletins</h1>
                    <p className="text-muted-foreground">Naviguez et exportez les bulletins par niveau, classe ou élève.</p>
                </div>
                 <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                    <SelectTrigger className="w-full sm:w-[220px] h-9"><SelectValue placeholder="Période" /></SelectTrigger>
                    <SelectContent>
                        {terms.map(term => <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span onClick={() => setPath([])} className="cursor-pointer hover:text-primary transition-colors">Bulletins</span>
                {path.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <ChevronRight className="h-4 w-4" />
                        <span onClick={() => setPath(path.slice(0, i + 1))} className="cursor-pointer hover:text-primary transition-colors">{p}</span>
                    </div>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-xl">{getHeaderTitle()}</CardTitle>
                        <Button onClick={() => handleExportZip(studentsToExport)} disabled={isExporting || !selectedTermId}>
                            {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                            Exporter {selectedStudents.size > 0 ? `(${selectedStudents.size})` : ''}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        {studentsInView.length > 0 && path.length >= (path[0] === 'Secondaire' && path[1] === 'Humanités' ? 4 : path[0] === 'Secondaire' ? 3 : 2)
                        ? `Affichage de ${studentsInView.length} élèves. Sélectionnés pour l'export : ${selectedStudents.size}`
                        : `Sélectionnez une catégorie pour voir les élèves.`
                        }
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
