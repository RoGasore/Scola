
'use client'

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const gradesData = [
  { id: 1, student: 'Alice Petit', level: 'Maternelle', classe: '1ère Maternelle', section: null, option: null, subject: 'Psychomotricité', grade: '18/20', date: '2024-05-15', evaluator: 'M. Dupont' },
  { id: 2, student: 'Léo Dubois', level: 'Maternelle', classe: '2ème Maternelle', section: null, option: null, subject: 'Langage', grade: '15/20', date: '2024-05-14', evaluator: 'Mme. Hugo' },
  { id: 3, student: 'Chloé Bernard', level: 'Primaire', classe: '1ère Primaire', section: null, option: null, subject: 'Histoire', grade: '19/20', date: '2024-05-13', evaluator: 'M. Vinci' },
  { id: 4, student: 'Hugo Martin', level: 'Primaire', classe: '6ème Primaire', section: null, option: null, subject: 'Physique', grade: '12/20', date: '2024-05-12', evaluator: 'Mme. Curie' },
  { id: 5, student: 'Manon Lefebvre', level: 'Secondaire', classe: '7ème Année', section: 'Éducation de base', option: null, subject: 'Anglais', grade: '16/20', date: '2024-05-11', evaluator: 'Mme. Lovelace' },
  { id: 6, student: 'Lucas Moreau', level: 'Secondaire', classe: '8ème Année', section: 'Éducation de base', option: null, subject: 'Chimie', grade: '14/20', date: '2024-05-10', evaluator: 'M. Lavoisier' },
  { id: 7, student: 'Jade Garcia', level: 'Secondaire', classe: '1ère Latin-Grec', section: 'Humanités', option: 'Latin-Grec', subject: 'Biologie', grade: '17/20', date: '2024-05-09', evaluator: 'M. Pasteur' },
  { id: 8, student: 'Louis Roux', level: 'Secondaire', classe: '2ème Sciences Économiques', section: 'Humanités', option: 'Sciences Économiques', subject: 'Philosophie', grade: 'A', date: '2024-05-08', evaluator: 'M. Descartes' },
];

const fuseOptions = {
  keys: ['student', 'subject'],
  threshold: 0.3,
};

export default function GradesPage() {
  const [filteredData, setFilteredData] = useState(gradesData);
  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const fuse = useMemo(() => new Fuse(gradesData, fuseOptions), []);
  
  useEffect(() => {
    let results = activeTab === 'Tous' 
      ? gradesData 
      : gradesData.filter(item => item.level === activeTab);
  
    if (searchTerm.trim()) {
      results = fuse.search(searchTerm).map(result => result.item).filter(item => {
        if (activeTab === 'Tous') return true;
        return item.level === activeTab;
      });
    }

    if (activeTab === 'Secondaire') {
      if (selectedSection !== 'all') {
        results = results.filter(s => s.section === selectedSection);
      }
      if (selectedOption !== 'all') {
        results = results.filter(s => s.option === selectedOption);
      }
    }

    if (selectedClass !== 'all') {
      results = results.filter(s => s.classe === selectedClass);
    }
    
    if (selectedSubject !== 'all') {
      results = results.filter(s => s.subject === selectedSubject);
    }

    setFilteredData(results);
  }, [searchTerm, activeTab, selectedClass, selectedSection, selectedOption, selectedSubject, fuse]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedClass('all');
    setSelectedSection('all');
    setSelectedOption('all');
    setSelectedSubject('all');
  };

  const getUniqueValues = (key: 'classe' | 'section' | 'option' | 'subject') => {
      let relevantData = activeTab === 'Tous' ? gradesData : gradesData.filter(s => s.level === activeTab);
      
      if (key === 'option' && selectedSection !== 'all' && activeTab === 'Secondaire') {
        relevantData = relevantData.filter(s => s.section === selectedSection);
      }
      
      const values = relevantData.map(s => s[key]).filter(Boolean);
      return [...new Set(values)] as string[];
  };

  const classes = getUniqueValues('classe');
  const sections = getUniqueValues('section');
  const options = getUniqueValues('option');
  const subjects = getUniqueValues('subject');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Notes</h1>
        <p className="text-muted-foreground">Consultez, ajoutez et modifiez les notes des évaluations.</p>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
            <TabsTrigger value="Tous">Tous</TabsTrigger>
            <TabsTrigger value="Maternelle">Maternelle</TabsTrigger>
            <TabsTrigger value="Primaire">Primaire</TabsTrigger>
            <TabsTrigger value="Secondaire">Secondaire</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
            <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Rechercher élève ou matière..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full sm:w-auto sm:ml-auto items-center gap-2 flex-wrap">
                        {activeTab === 'Secondaire' && (
                            <>
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger className="w-full sm:w-auto h-9"><SelectValue placeholder="Cycle" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous les cycles</SelectItem>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                            {selectedSection === 'Humanités' && (
                                <Select value={selectedOption} onValueChange={setSelectedOption}>
                                <SelectTrigger className="w-full sm:w-auto h-9"><SelectValue placeholder="Option" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Toutes les options</SelectItem>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            )}
                            </>
                        )}
                        {(activeTab !== 'Tous') && (
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Filtrer par classe" /></SelectTrigger>
                              <SelectContent><SelectItem value="all">Toutes les classes</SelectItem>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        )}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Filtrer par matière" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Toutes les matières</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="h-12 w-12 sm:w-auto"><Checkbox aria-label="Tout sélectionner" /></TableHead>
                        <TableHead>Élève</TableHead>
                        <TableHead className="hidden sm:table-cell">Classe</TableHead>
                        <TableHead className="hidden sm:table-cell">Matière</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden lg:table-cell">Évaluateur</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredData.length > 0 ? filteredData.map((grade, index) => (
                        <TableRow key={grade.id}>
                        <TableCell><Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} /></TableCell>
                        <TableCell className="font-medium">{grade.student}</TableCell>
                        <TableCell className="hidden sm:table-cell">{grade.classe}</TableCell>
                        <TableCell className="hidden sm:table-cell">{grade.subject}</TableCell>
                        <TableCell>
                            <Badge variant={parseInt(grade.grade) >= 15 ? "default" : parseInt(grade.grade) >= 10 ? "secondary" : "destructive"} className={
                                parseInt(grade.grade) >= 15 ? 'bg-green-500/80 text-white' : 
                                parseInt(grade.grade) >= 10 ? 'bg-yellow-500/80 text-black' :
                                'bg-red-500/80 text-white'
                            }>
                                {grade.grade}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{grade.date}</TableCell>
                        <TableCell className="hidden lg:table-cell">{grade.evaluator}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Ouvrir le menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Modifier la note</DropdownMenuItem>
                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                <DropdownMenuItem>Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            Aucun résultat.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
                <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Affichage de <strong>{filteredData.length}</strong> sur <strong>{gradesData.length}</strong> notes
                </div>
                <div className="ml-auto">
                    <Pagination>
                    <PaginationContent>
                        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationEllipsis /></PaginationItem>
                        <PaginationItem><PaginationNext href="#" /></PaginationItem>
                    </PaginationContent>
                    </Pagination>
                </div>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
