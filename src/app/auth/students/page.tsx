
'use client'

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { File, PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StudentEnrollmentForm } from '@/components/student-enrollment-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLevels, getClassesForLevel, getSectionsForSecondary, getOptionsForHumanites } from '@/lib/school-data';
import { getStudents } from '@/services/students';
import type { Student } from '@/types';
import StudentsLoading from './loading';

const fuseOptions = {
  keys: ['firstName', 'lastName', 'matricule', 'email'],
  threshold: 0.3,
};

export default function StudentsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all');

  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsLoading(true);
        const studentsFromDb = await getStudents();
        setAllStudents(studentsFromDb);
        setFilteredStudents(studentsFromDb);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les données des élèves.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);
  
  const fuse = useMemo(() => new Fuse(allStudents, fuseOptions), [allStudents]);

  useEffect(() => {
    let results = activeTab === 'Tous' ? allStudents : allStudents.filter(s => s.level === activeTab);

    if (searchTerm) {
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
    
    setFilteredStudents(results);
  }, [searchTerm, activeTab, selectedClass, selectedSection, selectedOption, fuse, allStudents]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedClass('all');
    setSelectedSection('all');
    setSelectedOption('all');
  }

  const levels = useMemo(() => getLevels(), []);
  const classes = useMemo(() => getClassesForLevel(activeTab, selectedSection, selectedOption), [activeTab, selectedSection, selectedOption]);
  const sections = useMemo(() => getSectionsForSecondary(), []);
  const options = useMemo(() => getOptionsForHumanites(), []);
  
  if (isLoading) {
    return <StudentsLoading />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
        <p className="text-muted-foreground">Recherchez, filtrez et gérez les informations des élèves.</p>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="Tous">Tous</TabsTrigger>
            {levels.map(level => <TabsTrigger key={level} value={level}>{level}</TabsTrigger>)}
          </TabsList>
           <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                  Exporter
                </span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Ajouter un élève
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-3xl bg-background">
                  <SheetHeader>
                    <SheetTitle>Inscrire un Nouvel Élève</SheetTitle>
                    <SheetDescription>
                      Remplissez le formulaire pour ajouter un nouvel élève au système.
                    </SheetDescription>
                  </SheetHeader>
                  <StudentEnrollmentForm />
                </SheetContent>
              </Sheet>
            </div>
        </div>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher nom, matricule..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex w-full sm:w-auto sm:ml-auto items-center gap-2 flex-wrap">
                  {activeTab === 'Secondaire' && (
                    <>
                      <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger className="w-full sm:w-auto h-9">
                          <SelectValue placeholder="Cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les cycles</SelectItem>
                          {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {selectedSection === 'Humanités' && (
                         <Select value={selectedOption} onValueChange={setSelectedOption}>
                          <SelectTrigger className="w-full sm:w-auto h-9">
                            <SelectValue placeholder="Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les options</SelectItem>
                            {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                  {(activeTab !== 'Tous') && (
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-full sm:w-auto h-9">
                        <SelectValue placeholder="Classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les classes</SelectItem>
                         {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead className="h-12 w-12 sm:w-auto">
                      <Checkbox aria-label="Tout sélectionner" />
                    </TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead className="hidden sm:table-cell">Classe</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => {
                      const fullName = `${student.firstName} ${student.lastName}`;
                      const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`;
                      return (
                        <TableRow key={student.matricule}>
                           <TableCell>
                            <Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} />
                          </TableCell>
                          <TableCell className="font-medium">{student.matricule}</TableCell>
                          <TableCell>
                              <div className="flex items-center gap-3">
                                  <Avatar className="hidden h-9 w-9 sm:flex">
                                      <AvatarImage src={`https://placehold.co/40x40.png`} alt={fullName} data-ai-hint={student.avatar} />
                                      <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="grid gap-0.5">
                                      <Link href={`/auth/students/${encodeURIComponent(student.matricule)}`} className="font-medium hover:underline">{fullName}</Link>
                                      <span className="text-xs text-muted-foreground">{student.email}</span>
                                  </div>
                              </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{student.classe}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                                student.status === 'Actif' ? 'text-green-600 border-green-500/50 bg-green-500/10' :
                                student.status === 'Inactif' ? 'text-red-600 border-red-500/50 bg-red-500/10' :
                                'text-yellow-600 border-yellow-500/50 bg-yellow-500/10'
                              }>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(student.dateJoined).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Ouvrir le menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                 <DropdownMenuItem asChild>
                                  <Link href={`/auth/students/${encodeURIComponent(student.matricule)}`}>Voir le profil</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem>Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Aucun résultat.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
               <div className="text-xs text-muted-foreground">
                Affichage de <strong>{filteredStudents.length}</strong> sur <strong>{allStudents.length}</strong> élèves
              </div>
               <div className="ml-auto">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
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
