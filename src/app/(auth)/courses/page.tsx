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
  { id: '#C-MAT01', name: 'Mathématiques de Base', professeur: 'M. Dupont', classe: 'Seconde', option: 'Général', heures: '3h/sem', status: 'Terminé', date: '20/02/2024' },
  { id: '#C-PHY02', name: 'Introduction à la Physique', professeur: 'Mme. Curie', classe: 'Première', option: 'Sciences', heures: '4h/sem', status: 'En cours', date: '05/01/2024' },
  { id: '#C-ART03', name: 'Histoire de l\'Art', professeur: 'M. Vinci', classe: 'Terminale', option: 'Arts', heures: '2h/sem', status: 'Terminé', date: '12/12/2023' },
  { id: '#C-CHI04', name: 'Chimie Organique', professeur: 'M. Lavoisier', classe: 'Première', option: 'Sciences', heures: '4h/sem', status: 'Annulé', date: '02/11/2023' },
  { id: '#C-INF05', name: 'Programmation Python', professeur: 'Mme. Lovelace', classe: 'Terminale', option: 'Numérique', heures: '5h/sem', status: 'Terminé', date: '15/10/2023' },
  { id: '#C-LIT06', name: 'Littérature Française', professeur: 'M. Hugo', classe: 'Seconde', option: 'Général', heures: '3h/sem', status: 'En cours', date: '28/09/2023' },
  { id: '#C-BIO07', name: 'Biologie Cellulaire', professeur: 'M. Pasteur', classe: 'Terminale', option: 'Sciences de la Vie', heures: '4h/sem', status: 'Terminé', date: '21/08/2023' },
  { id: '#C-PHI08', name: 'Philosophie Moderne', professeur: 'M. Descartes', classe: 'Terminale', option: 'Humanités', heures: '2h/sem', status: 'Terminé', date: '10/07/2023' },
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
              <DropdownMenuLabel>Filtrer par Classe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Seconde</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Première</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Terminale</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filtrer par Option</DropdownMenuLabel>
               <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Général</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Sciences</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Numérique</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Arts</DropdownMenuCheckboxItem>
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
                  <TableHead>Professeur</TableHead>
                  <TableHead className="hidden sm:table-cell">Classe</TableHead>
                  <TableHead className="hidden md:table-cell">Option</TableHead>
                  <TableHead className="hidden md:table-cell">Heures</TableHead>
                  <TableHead>Statut</TableHead>
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
                    <TableCell>{course.professeur}</TableCell>
                    <TableCell className="hidden sm:table-cell">{course.classe}</TableCell>
                    <TableCell className="hidden md:table-cell">{course.option}</TableCell>
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
