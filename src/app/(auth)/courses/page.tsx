
'use client'

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { File, PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const coursesData = [
  // Maternelle & Primaire (pas de section/option)
  { id: '#C-MAT01', name: 'Découverte des Nombres', professeur: 'Mme. Pascal', level: 'Maternelle', classe: '1ère Maternelle', section: null, option: null, heures: '2h/sem', status: 'En cours' },
  { id: '#C-ART01', name: 'Éveil Artistique', professeur: 'M. Monet', level: 'Maternelle', classe: '2ème Maternelle', section: null, option: null, heures: '1h/sem', status: 'Terminé' },
  { id: '#C-FRA01', name: 'Lecture et Écriture', professeur: 'M. Flaubert', level: 'Primaire', classe: '1ère Primaire', section: null, option: null, heures: '5h/sem', status: 'En cours' },
  { id: '#C-GEO01', name: 'Géographie du Monde', professeur: 'Mme. Polo', level: 'Primaire', classe: '5ème Primaire', section: null, option: null, heures: '2h/sem', status: 'Terminé' },

  // Secondaire
  { id: '#C-MAT02', name: 'Mathématiques de Base', professeur: 'M. Dupont', level: 'Secondaire', classe: 'Seconde', section: 'Humanités', option: 'Général', heures: '3h/sem', status: 'Terminé' },
  { id: '#C-PHY02', name: 'Introduction à la Physique', professeur: 'Mme. Curie', level: 'Secondaire', classe: 'Première', section: 'Humanités', option: 'Sciences', heures: '4h/sem', status: 'En cours' },
  { id: '#C-ART03', name: 'Histoire de l\'Art', professeur: 'M. Vinci', level: 'Secondaire', classe: 'Terminale', section: 'Humanités', option: 'Arts', heures: '2h/sem', status: 'Terminé' },
  { id: '#C-CHI04', name: 'Chimie Organique', professeur: 'M. Lavoisier', level: 'Secondaire', classe: 'Première', section: 'Humanités', option: 'Sciences', heures: '4h/sem', status: 'Annulé' },
  { id: '#C-INF05', name: 'Programmation Python', professeur: 'Mme. Lovelace', level: 'Secondaire', classe: 'Terminale', section: 'Éducation de base', option: 'Numérique', heures: '5h/sem', status: 'Terminé' },
  { id: '#C-LIT06', name: 'Littérature Française', professeur: 'M. Hugo', level: 'Secondaire', classe: 'Seconde', section: 'Humanités', option: 'Général', heures: '3h/sem', status: 'En cours' },
  { id: '#C-BIO07', name: 'Biologie Cellulaire', professeur: 'M. Pasteur', level: 'Secondaire', classe: 'Terminale', section: 'Humanités', option: 'Sciences de la Vie', heures: '4h/sem', status: 'Terminé' },
  { id: '#C-PHI08', name: 'Philosophie Moderne', professeur: 'M. Descartes', level: 'Secondaire', classe: 'Terminale', section: 'Humanités', option: 'Humanités', heures: '2h/sem', status: 'Terminé' },
];

const fuseOptions = {
    keys: ['name', 'professeur', 'id'],
    threshold: 0.3,
};

export default function CoursesPage() {
    const [filteredData, setFilteredData] = useState(coursesData);
    const [activeTab, setActiveTab] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedSection, setSelectedSection] = useState('all');
    const [selectedOption, setSelectedOption] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const fuse = useMemo(() => new Fuse(coursesData, fuseOptions), []);

    useEffect(() => {
        let results = activeTab === 'Tous'
            ? coursesData
            : coursesData.filter(item => item.level === activeTab);

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

        if (selectedStatus !== 'all') {
            results = results.filter(s => s.status === selectedStatus);
        }

        setFilteredData(results);
    }, [searchTerm, activeTab, selectedClass, selectedSection, selectedOption, selectedStatus, fuse]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchTerm('');
        setSelectedClass('all');
        setSelectedSection('all');
        setSelectedOption('all');
        setSelectedStatus('all');
    };

    const getUniqueValues = (key: 'classe' | 'section' | 'option' | 'status') => {
        let relevantData = activeTab === 'Tous' ? coursesData : coursesData.filter(s => s.level === activeTab);
        
        if (key === 'option' && selectedSection !== 'all' && activeTab === 'Secondaire') {
          relevantData = relevantData.filter(s => s.section === selectedSection);
        }
        
        const values = relevantData.map(s => s[key]).filter(Boolean);
        return [...new Set(values)] as string[];
    };
  
    const classes = getUniqueValues('classe');
    const sections = getUniqueValues('section');
    const options = getUniqueValues('option');
    const statuses = getUniqueValues('status');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
        <p className="text-muted-foreground">Gérez les cours et les matières de votre établissement.</p>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center mb-4">
            <TabsList>
                <TabsTrigger value="Tous">Tous</TabsTrigger>
                <TabsTrigger value="Maternelle">Maternelle</TabsTrigger>
                <TabsTrigger value="Primaire">Primaire</TabsTrigger>
                <TabsTrigger value="Secondaire">Secondaire</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exporter</span>
                </Button>
                <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Ajouter un cours
                    </span>
                </Button>
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
                             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
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
                        <TableHead>ID Cours</TableHead>
                        <TableHead>Nom du cours</TableHead>
                        <TableHead>Professeur</TableHead>
                        <TableHead className="hidden sm:table-cell">Classe</TableHead>
                        <TableHead className="hidden md:table-cell">Option</TableHead>
                        <TableHead className="hidden md:table-cell">Heures</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((course, index) => (
                        <TableRow key={index}>
                            <TableCell>
                            <Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} />
                            </TableCell>
                            <TableCell className="font-medium">{course.id}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.professeur}</TableCell>
                            <TableCell className="hidden sm:table-cell">{course.classe}</TableCell>
                            <TableCell className="hidden md:table-cell">{course.option || 'N/A'}</TableCell>
                            <TableCell className="hidden md:table-cell">{course.heures}</TableCell>
                            <TableCell>
                            <Badge variant={
                                course.status === 'Terminé' ? 'default' : 
                                course.status === 'En cours' ? 'secondary' :
                                'destructive'
                            } className={
                                course.status === 'Terminé' ? 'bg-green-500/80 text-white' : 
                                course.status === 'En cours' ? 'bg-yellow-500/80 text-black' :
                                'bg-red-500/80 text-white'
                            }>
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
                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                    Affichage de <strong>{filteredData.length}</strong> sur <strong>{coursesData.length}</strong> cours
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
