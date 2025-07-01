
'use client'

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const attendanceData = [
  { student: 'Alice Petit', matricule: 'M24001', level: 'Maternelle', classe: '1ère Maternelle', section: null, option: null, date: '2024-05-20', status: 'Présent' },
  { student: 'Léo Dubois', matricule: 'M24002', level: 'Maternelle', classe: '2ème Maternelle', section: null, option: null, date: '2024-05-20', status: 'Présent' },
  { student: 'Chloé Bernard', matricule: 'P24001', level: 'Primaire', classe: '1ère Primaire', section: null, option: null, date: '2024-05-20', status: 'Absent' },
  { student: 'Hugo Martin', matricule: 'P24002', level: 'Primaire', classe: '6ème Primaire', section: null, option: null, date: '2024-05-20', status: 'Présent' },
  { student: 'Manon Lefebvre', matricule: 'S24001', level: 'Secondaire', classe: '1ère', section: 'Éducation de base', option: null, date: '2024-05-20', status: 'En retard' },
  { student: 'Lucas Moreau', matricule: 'S24002', level: 'Secondaire', classe: '2ème', section: 'Éducation de base', option: null, date: '2024-05-20', status: 'Présent' },
  { student: 'Jade Garcia', matricule: 'S24003', level: 'Secondaire', classe: '3ème', section: 'Humanités', option: 'Latin-Grec', date: '2024-05-20', status: 'Présent' },
  { student: 'Louis Roux', matricule: 'S24004', level: 'Secondaire', classe: '4ème', section: 'Humanités', option: 'Sciences Économiques', date: '2024-05-20', status: 'Absent' },
  { student: 'Alice Petit', matricule: 'M24001', level: 'Maternelle', classe: '1ère Maternelle', section: null, option: null, date: '2024-05-19', status: 'Présent' },
  { student: 'Léo Dubois', matricule: 'M24002', level: 'Maternelle', classe: '2ème Maternelle', section: null, option: null, date: '2024-05-19', status: 'Présent' },
];

const fuseOptions = {
  keys: ['student'],
  threshold: 0.3,
};

export default function AttendancePage() {
  const [filteredData, setFilteredData] = useState(attendanceData);
  const [activeTab, setActiveTab] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedOption, setSelectedOption] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fuse = useMemo(() => new Fuse(attendanceData, fuseOptions), []);
  
  useEffect(() => {
    let results = activeTab === 'Tous' 
      ? attendanceData 
      : attendanceData.filter(item => item.level === activeTab);
  
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

  const getUniqueValues = (key: 'classe' | 'section' | 'option') => {
      let relevantData = activeTab === 'Tous' ? attendanceData : attendanceData.filter(s => s.level === activeTab);
      
      if (key === 'option' && selectedSection !== 'all' && activeTab === 'Secondaire') {
        relevantData = relevantData.filter(s => s.section === selectedSection);
      }
      
      const values = relevantData.map(s => s[key]).filter(Boolean);
      return [...new Set(values)] as string[];
  };

  const classes = getUniqueValues('classe');
  const sections = getUniqueValues('section');
  const options = getUniqueValues('option');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Suivi des Présences</h1>
        <p className="text-muted-foreground">Consultez et gérez les présences des élèves.</p>
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
                        placeholder="Rechercher un élève..."
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
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">Tous les statuts</SelectItem>
                              <SelectItem value="Présent">Présent</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="En retard">En retard</SelectItem>
                          </SelectContent>
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
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? filteredData.map((record, index) => (
                        <TableRow key={`${record.matricule}-${record.date}`}>
                          <TableCell><Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} /></TableCell>
                          <TableCell className="font-medium">{record.student}</TableCell>
                          <TableCell className="hidden sm:table-cell">{record.classe}</TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                                record.status === 'Présent' ? 'text-green-600 border-green-500/50 bg-green-500/10' :
                                record.status === 'Absent' ? 'text-red-600 border-red-500/50 bg-red-500/10' :
                                'text-yellow-600 border-yellow-500/50 bg-yellow-500/10'
                              }>
                              {record.status}
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
                                <DropdownMenuItem>Marquer Présent</DropdownMenuItem>
                                <DropdownMenuItem>Marquer Absent</DropdownMenuItem>
                                <DropdownMenuItem>Voir le profil de l'élève</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Aucun résultat.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Affichage de <strong>{filteredData.length}</strong> sur <strong>{attendanceData.length}</strong> enregistrements
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
