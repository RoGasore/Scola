
'use client'

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { File, PlusCircle, MoreHorizontal, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { CourseManagementForm } from '@/components/course-management-form';
import { schoolStructure, flattenStructureToCourses, getLevels, getClassesForLevel, getSectionsForSecondary, getOptionsForHumanites } from '@/lib/school-data';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const fuseOptions = {
    keys: ['name', 'professeur', 'id', 'className', 'option'],
    threshold: 0.3,
};

export default function CoursesPage() {
    const [allCourses, setAllCourses] = useState(flattenStructureToCourses(schoolStructure));
    const [filteredData, setFilteredData] = useState(allCourses);
    const [activeTab, setActiveTab] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedSection, setSelectedSection] = useState('all');
    const [selectedOption, setSelectedOption] = useState('all');

    const fuse = useMemo(() => new Fuse(allCourses, fuseOptions), [allCourses]);

    useEffect(() => {
        let results = activeTab === 'Tous'
            ? allCourses
            : allCourses.filter(item => item.level === activeTab);

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
            results = results.filter(s => s.className === selectedClass);
        }

        setFilteredData(results);
    }, [searchTerm, activeTab, selectedClass, selectedSection, selectedOption, fuse, allCourses]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchTerm('');
        setSelectedClass('all');
        setSelectedSection('all');
        setSelectedOption('all');
    };

    const classes = useMemo(() => getClassesForLevel(activeTab), [activeTab]);
    const sections = useMemo(() => getSectionsForSecondary(), []);
    const options = useMemo(() => getOptionsForHumanites(), []);
    const levels = useMemo(() => getLevels(), []);

    const onStructureUpdate = (newStructure: any) => {
        // In a real app, this would be a state update that triggers a re-fetch or is persisted.
        // For now, we'll just re-flatten the imported structure.
        console.log("Structure updated", newStructure);
        setAllCourses(flattenStructureToCourses(newStructure));
    };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
        <p className="text-muted-foreground">Consultez les cours et gérez la structure de l'établissement.</p>
      </div>
      <div className="flex items-center mb-4">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                  <TabsTrigger value="Tous">Tous</TabsTrigger>
                  {levels.map(level => <TabsTrigger key={level} value={level}>{level}</TabsTrigger>)}
              </TabsList>
          </Tabs>
          <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exporter</span>
              </Button>
              <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Settings className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Gérer la Structure
                        </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-4xl w-full">
                        <SheetHeader>
                            <SheetTitle>Gestion de la Structure Scolaire</SheetTitle>
                            <SheetDescription>
                                Définissez les niveaux, classes, options et cours de votre établissement.
                            </SheetDescription>
                        </SheetHeader>
                        <CourseManagementForm initialStructure={schoolStructure} onUpdate={onStructureUpdate} />
                  </SheetContent>
              </Sheet>
          </div>
      </div>
        
      <Card>
          <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full sm:w-72">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                          type="search"
                          placeholder="Rechercher un cours..."
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
                          <Select value={selectedOption} onValueChange={setSelectedOption}>
                              <SelectTrigger className="w-full sm:w-auto h-9"><SelectValue placeholder="Option" /></SelectTrigger>
                              <SelectContent><SelectItem value="all">Toutes les options</SelectItem>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                          </>
                      )}
                      {(activeTab !== 'Tous') && (
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                              <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Filtrer par classe" /></SelectTrigger>
                              <SelectContent><SelectItem value="all">Toutes les classes</SelectItem>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                      )}
                  </div>
              </div>
          </CardHeader>
          <CardContent>
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Nom du cours</TableHead>
                  <TableHead>Professeur</TableHead>
                  <TableHead className="hidden sm:table-cell">Classe</TableHead>
                  <TableHead className="hidden md:table-cell">Option</TableHead>
                  <TableHead className="hidden md:table-cell">Heures/sem</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredData.length > 0 ? (filteredData.map((course, index) => (
                  <TableRow key={index}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.professeur || 'N/A'}</TableCell>
                      <TableCell className="hidden sm:table-cell">{course.className}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.option || 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{course.hours}</TableCell>
                      <TableCell>
                      <Badge variant={course.status === 'Actif' ? 'secondary' : 'destructive'} className={ course.status === 'Actif' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white' }>
                          {course.status}
                      </Badge>
                      </TableCell>
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
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Désactiver</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </TableCell>
                  </TableRow>
                  ))) : (
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
              Affichage de <strong>{filteredData.length}</strong> sur <strong>{allCourses.length}</strong> cours
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
    </div>
  )
}

    