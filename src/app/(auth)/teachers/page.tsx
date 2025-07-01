
'use client'

import * as React from 'react';
import { File, PlusCircle, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { TeacherRegistrationForm } from '@/components/teacher-registration-form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';

const teachersData = [
  {
    id: 'T001',
    name: 'Jean Dupont',
    email: 'jean.dupont@scolagest.cd',
    avatar: 'homme noir',
    department: 'Mathématiques',
    assignments: ['4ème - Math', '5ème - Math'],
    status: 'Actif',
    hireDate: '2020-08-15',
  },
  {
    id: 'T002',
    name: 'Marie Curie',
    email: 'marie.curie@scolagest.cd',
    avatar: 'femme blanche',
    department: 'Sciences',
    assignments: ['4ème - Physique', '4ème - Chimie', '6ème - Chimie'],
    status: 'Actif',
    hireDate: '2018-03-20',
  },
  {
    id: 'T003',
    name: 'Victor Hugo',
    email: 'victor.hugo@scolagest.cd',
    avatar: 'homme blanc',
    department: 'Lettres',
    assignments: ['3ème - Français', '4ème - Littérature'],
    status: 'En congé',
    hireDate: '2021-09-01',
  },
    {
    id: 'T004',
    name: 'Amina Diallo',
    email: 'amina.diallo@scolagest.cd',
    avatar: 'femme africaine',
    department: 'Langues',
    assignments: ['1ère - Anglais', '2ème - Anglais', '3ème - Anglais'],
    status: 'Actif',
    hireDate: '2022-01-10',
  },
];


export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Note: For a real app, filtering logic would be implemented here.
  const filteredTeachers = teachersData.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Professeurs</h1>
        <p className="text-muted-foreground">Gérez le personnel enseignant de votre établissement.</p>
      </div>

       <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, email..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exporter</span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Ajouter un professeur
                      </span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-4xl bg-background">
                  <SheetHeader>
                    <SheetTitle>Enregistrer un Nouveau Professeur</SheetTitle>
                    <SheetDescription>
                      Remplissez le formulaire pour ajouter un nouveau membre du personnel enseignant.
                    </SheetDescription>
                  </SheetHeader>
                  <TeacherRegistrationForm />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professeur</TableHead>
                <TableHead className="hidden sm:table-cell">Département</TableHead>
                <TableHead className="hidden md:table-cell">Assignations</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden lg:table-cell">Date d'embauche</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage src={`https://placehold.co/40x40.png`} alt={teacher.name} data-ai-hint={teacher.avatar} />
                              <AvatarFallback>{teacher.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                              <span className="font-medium">{teacher.name}</span>
                              <span className="text-xs text-muted-foreground">{teacher.email}</span>
                          </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{teacher.department}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignments.map((assignment, i) => (
                          <Badge key={i} variant="secondary">{assignment}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className={
                          teacher.status === 'Actif' ? 'text-green-600 border-green-500/50 bg-green-500/10' :
                          'text-yellow-600 border-yellow-500/50 bg-yellow-500/10'
                        }>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{teacher.hireDate}</TableCell>
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
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                          <DropdownMenuItem>Archiver</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun professeur trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
              Affichage de <strong>{filteredTeachers.length}</strong> sur <strong>{teachersData.length}</strong> professeurs
            </div>
            <div className="ml-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
