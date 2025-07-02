
'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Search, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLevels, getClassesForLevel, getSectionsForSecondary, getOptionsForHumanites } from '@/lib/school-data';
import { getStudents } from '@/services/students';
import type { Student } from '@/types';
import BulletinsLoading from './loading';
import { useToast } from '@/hooks/use-toast';
import { BulletinView, type BulletinData } from '@/components/bulletin-view';
import { getBulletinDataForStudent } from '@/services/bulletins';
import { getAcademicTerms } from '@/services/academic';

const fuseOptions = {
  keys: ['firstName', 'lastName', 'matricule'],
  threshold: 0.3,
};

export default function BulletinsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all');
  
  const bulletinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [studentsFromDb, academicTerms] = await Promise.all([
          getStudents(),
          getAcademicTerms()
        ]);

        setAllStudents(studentsFromDb);
        setFilteredStudents(studentsFromDb);

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
  
  const fuse = useMemo(() => new Fuse(allStudents, fuseOptions), [allStudents]);

  useEffect(() => {
    let results = allStudents.filter(s => {
        if (activeTab === 'Tous') return true;
        return s.level === activeTab;
    });

    if (searchTerm) {
      results = fuse.search(searchTerm).map(result => result.item).filter(item => {
        if (activeTab === 'Tous') return true;
        return item.level === activeTab;
      });
    }

    if (activeTab === 'Secondaire') {
      if (selectedSection !== 'all') results = results.filter(s => s.section === selectedSection);
      if (selectedOption !== 'all') results = results.filter(s => s.option === selectedOption);
    }

    if (selectedClass !== 'all') {
      results = results.filter(s => s.classe === selectedClass);
    }
    
    setFilteredStudents(results);
  }, [searchTerm, activeTab, selectedClass, selectedSection, selectedOption, fuse, allStudents]);

  const handleExportZip = async () => {
      if (!selectedTermId) {
          toast({ variant: 'destructive', title: 'Aucune période sélectionnée', description: 'Veuillez sélectionner une période pour l\'export.' });
          return;
      }
      setIsExporting(true);
      toast({ title: 'Démarrage de l\'exportation', description: 'La préparation du fichier ZIP peut prendre quelques minutes...' });

      const zip = new JSZip();
      const term = terms.find(t => t.id === selectedTermId);
      if (!term) return;
      
      const bulletinDataPromises = filteredStudents.map(student => getBulletinDataForStudent(student.id!, selectedTermId));
      const allBulletinData = await Promise.all(bulletinDataPromises);

      for (const data of allBulletinData) {
          if (data) {
              const { student } = data;
              // This is a simplified simulation. A real implementation would render the component to an off-screen canvas.
              // For now, we'll create a simple text-based PDF as a placeholder.
              const pdf = new jsPDF();
              pdf.text(`Bulletin de ${student.firstName} ${student.lastName}`, 10, 10);
              pdf.text(`Classe: ${student.classe}`, 10, 20);
              pdf.text(`Période: ${term.name}`, 10, 30);
              // In a real scenario, we would loop through grades here.
              const pdfBlob = pdf.output('blob');

              let path = '';
              if (student.level === 'Primaire' || student.level === 'Maternelle') {
                  path = `${student.level}/${student.classe}/`;
              } else if (student.level === 'Secondaire') {
                  path = `${student.level}/${student.section || ''}/${student.option || ''}/${student.classe}/`.replace('//','/');
              }
              
              zip.file(`${path}Bulletin_${student.lastName}_${student.firstName}.pdf`, pdfBlob);
          }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `Bulletins_${term.name}.zip`);

      setIsExporting(false);
      toast({ title: 'Exportation terminée', description: 'Le fichier ZIP a été téléchargé.', className: 'bg-green-500 text-white' });
  };
  
  const levels = useMemo(() => getLevels(), []);
  const classes = useMemo(() => getClassesForLevel(activeTab, selectedSection, selectedOption), [activeTab, selectedSection, selectedOption]);
  const sections = useMemo(() => getSectionsForSecondary(), []);
  const options = useMemo(() => getOptionsForHumanites(), []);
  
  if (isLoading) {
    return <BulletinsLoading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Bulletins</h1>
        <p className="text-muted-foreground">Visualisez et exportez les bulletins des élèves.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Rechercher nom, matricule..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap justify-end">
                <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                    <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Période" /></SelectTrigger>
                    <SelectContent>
                        {terms.map(term => <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={handleExportZip} disabled={isExporting || !selectedTermId} className="w-full sm:w-auto">
                    {isExporting ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                    Exporter le ZIP
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Élève</TableHead><TableHead className="hidden sm:table-cell">Classe</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.matricule}>
                    <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{student.classe}</TableCell>
                    <TableCell>{student.status}</TableCell>
                    <TableCell className="text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" disabled={!selectedTermId}>
                                    <FileText className="mr-2" />
                                    Voir le bulletin
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Bulletin de {student.firstName} {student.lastName}</DialogTitle>
                                    <DialogDescription>
                                        Période: {terms.find(t => t.id === selectedTermId)?.name}
                                    </DialogDescription>
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
                <TableRow><TableCell colSpan={4} className="h-24 text-center">Aucun élève trouvé.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">Affichage de <strong>{filteredStudents.length}</strong> sur <strong>{allStudents.length}</strong> élèves</div>
        </CardFooter>
      </Card>
    </div>
  )
}
