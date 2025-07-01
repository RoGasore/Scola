import { File, PlusCircle, MoreHorizontal, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination'

const courses = [
  { id: '#C101', name: 'Mathématiques de Base', student: 'Olivia Martin', status: 'Terminé', date: '20/02/2024', price: '250.00 €' },
  { id: '#C102', name: 'Introduction à la Physique', student: 'Ava Johnson', status: 'En cours', date: '05/01/2024', price: '150.00 €' },
  { id: '#C103', name: 'Histoire de l\'Art', student: 'Liam Smith', status: 'Terminé', date: '12/12/2023', price: '350.50 €' },
  { id: '#C104', name: 'Chimie Organique', student: 'Noah Brown', status: 'Annulé', date: '02/11/2023', price: '89.99 €' },
  { id: '#C105', name: 'Programmation Python', student: 'Emma Garcia', status: 'Terminé', date: '15/10/2023', price: '200.00 €' },
  { id: '#C106', name: 'Littérature Française', student: 'James Wilson', status: 'En cours', date: '28/09/2023', price: '75.20 €' },
  { id: '#C107', name: 'Biologie Cellulaire', student: 'Sophia Miller', status: 'Terminé', date: '21/08/2023', price: '120.00 €' },
  { id: '#C108', name: 'Philosophie Moderne', student: 'Isabella Davis', status: 'Terminé', date: '10/07/2023', price: '300.00 €' },
];

export default function CoursesPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="termine">Terminé</TabsTrigger>
          <TabsTrigger value="en_cours">En cours</TabsTrigger>
          <TabsTrigger value="annule" className="hidden sm:flex">Annulé</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrer
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Terminé</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>En cours</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Annulé</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Cours</CardTitle>
            <CardDescription>
              Gérez les cours et les inscriptions de vos élèves.
            </CardDescription>
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
                  <TableHead className="hidden md:table-cell">Élève</TableHead>
                  <TableHead className="hidden sm:table-cell">Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} />
                    </TableCell>
                    <TableCell className="font-medium">{course.id}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.student}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                       <Badge variant="outline" className={
                        course.status === 'Terminé' ? 'text-green-400 border-green-400/50' : 
                        course.status === 'En cours' ? 'text-yellow-400 border-yellow-400/50' :
                        'text-red-400 border-red-400/50'
                      }>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{course.date}</TableCell>
                    <TableCell className="text-right">{course.price}</TableCell>
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
              Affichage de <strong>1-8</strong> sur <strong>32</strong> cours
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
  )
}
