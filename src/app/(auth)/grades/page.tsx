
'use client'

import { useState } from 'react';
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

const gradesData = [
  { id: 1, student: 'Alice Petit', subject: 'Mathématiques', grade: '18/20', date: '2024-05-15', evaluator: 'M. Dupont' },
  { id: 2, student: 'Léo Dubois', subject: 'Français', grade: '15/20', date: '2024-05-14', evaluator: 'Mme. Hugo' },
  { id: 3, student: 'Chloé Bernard', subject: 'Histoire', grade: '19/20', date: '2024-05-13', evaluator: 'M. Vinci' },
  { id: 4, student: 'Hugo Martin', subject: 'Physique', grade: '12/20', date: '2024-05-12', evaluator: 'Mme. Curie' },
  { id: 5, student: 'Manon Lefebvre', subject: 'Anglais', grade: '16/20', date: '2024-05-11', evaluator: 'Mme. Lovelace' },
  { id: 6, student: 'Lucas Moreau', subject: 'Chimie', grade: '14/20', date: '2024-05-10', evaluator: 'M. Lavoisier' },
  { id: 7, student: 'Jade Garcia', subject: 'Biologie', grade: '17/20', date: '2024-05-09', evaluator: 'M. Pasteur' },
  { id: 8, student: 'Louis Roux', subject: 'Philosophie', grade: 'A', date: '2024-05-08', evaluator: 'M. Descartes' },
];

export default function GradesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // TODO: Implement filtering logic
  const filteredData = gradesData;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Notes</h1>
        <p className="text-muted-foreground">Consultez, ajoutez et modifiez les notes des évaluations.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Rechercher un élève ou une matière..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex w-full sm:w-auto sm:ml-auto items-center gap-2 flex-wrap">
                 <Select>
                    <SelectTrigger className="w-full sm:w-auto h-9">
                        <SelectValue placeholder="Filtrer par classe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les classes</SelectItem>
                        <SelectItem value="Maternelle">Maternelle</SelectItem>
                        <SelectItem value="Primaire">Primaire</SelectItem>
                        <SelectItem value="Secondaire">Secondaire</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger className="w-full sm:w-auto h-9">
                        <SelectValue placeholder="Filtrer par matière" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les matières</SelectItem>
                        <SelectItem value="maths">Mathématiques</SelectItem>
                        <SelectItem value="physique">Physique</SelectItem>
                        <SelectItem value="histoire">Histoire</SelectItem>
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
                <TableHead className="hidden sm:table-cell">Matière</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Évaluateur</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((grade, index) => (
                <TableRow key={grade.id}>
                  <TableCell><Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} /></TableCell>
                  <TableCell className="font-medium">{grade.student}</TableCell>
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
                  <TableCell className="hidden sm:table-cell">{grade.evaluator}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
           <div className="text-xs text-muted-foreground">
            Affichage de <strong>1-8</strong> sur <strong>{gradesData.length}</strong> notes
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
    </div>
  )
}
