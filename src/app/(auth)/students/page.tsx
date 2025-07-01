import {
  File,
  PlusCircle,
  MoreHorizontal,
  ListFilter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { StudentEnrollmentForm } from '@/components/student-enrollment-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination'

const students = [
  { name: 'Jean Dupont', email: 'jean.d@example.com', type: 'Premium', status: 'Actif', dateJoined: '2023-06-23' },
  { name: 'Amina Ndiaye', email: 'amina.n@example.com', type: 'Standard', status: 'Inactif', dateJoined: '2023-02-14' },
  { name: 'John Smith', email: 'john.s@example.com', type: 'Premium', status: 'Actif', dateJoined: '2023-01-15' },
  { name: 'Maria Garcia', email: 'maria.g@example.com', type: 'VIP', status: 'Actif', dateJoined: '2022-11-30' },
  { name: 'Chen Wei', email: 'chen.w@example.com', type: 'Standard', status: 'En attente', dateJoined: '2023-07-01' },
  { name: 'Fatima Zahra', email: 'fatima.z@example.com', type: 'Premium', status: 'Actif', dateJoined: '2023-03-20' },
  { name: 'David Miller', email: 'david.m@example.com', type: 'Standard', status: 'Inactif', dateJoined: '2022-09-10' },
];

export default function StudentsPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs</TabsTrigger>
          <TabsTrigger value="pending" className="hidden sm:flex">En attente</TabsTrigger>
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
              <DropdownMenuCheckboxItem checked>
                Actif
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inactif</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                En attente
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
            <SheetContent className="sm:max-w-2xl bg-background">
              <SheetHeader>
                <SheetTitle>Ajouter un Nouvel Élève</SheetTitle>
                <SheetDescription>
                  Remplissez le formulaire pour ajouter un nouvel élève au système.
                </SheetDescription>
              </SheetHeader>
              <StudentEnrollmentForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Liste des Élèves</CardTitle>
            <CardDescription>
              Gérez vos élèves et consultez leurs informations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                   <TableHead className="h-12 w-12 sm:w-auto">
                    <Checkbox aria-label="Tout sélectionner" />
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                     <TableCell>
                      <Checkbox aria-label={`Sélectionner la ligne ${index + 1}`} />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">{student.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                          student.status === 'Actif' ? 'text-green-400 border-green-400/50' :
                          student.status === 'Inactif' ? 'text-red-400 border-red-400/50' :
                          'text-yellow-400 border-yellow-400/50'
                        }>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.dateJoined}
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
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Voir le profil</DropdownMenuItem>
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
              Affichage de <strong>1-7</strong> sur <strong>42</strong> élèves
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
