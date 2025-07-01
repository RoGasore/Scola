import {
  File,
  PlusCircle,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { StudentEnrollmentForm } from '@/components/student-enrollment-form'

export default function StudentsPage() {
  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Élèves</h1>
        <div className="ml-auto flex items-center gap-2">
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
            <SheetContent className="sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Inscrire un nouvel élève</SheetTitle>
                <SheetDescription>
                  Remplissez le formulaire ci-dessous pour ajouter un nouvel élève au système.
                </SheetDescription>
              </SheetHeader>
              <StudentEnrollmentForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des élèves</CardTitle>
          <CardDescription>
            Gérez vos élèves et consultez leurs informations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead className="hidden sm:table-cell">Classe</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Contact Parent</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Jean Dupont</TableCell>
                <TableCell className="hidden md:table-cell">ST-2024-001</TableCell>
                <TableCell className="hidden sm:table-cell">4ème Humanités - Math/Physique</TableCell>
                <TableCell>
                  <Badge variant="outline">Actif</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  parent@example.com
                </TableCell>
                <TableCell>
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
              <TableRow>
                <TableCell className="font-medium">Amina Ndiaye</TableCell>
                <TableCell className="hidden md:table-cell">ST-2024-002</TableCell>
                <TableCell className="hidden sm:table-cell">6ème Primaire</TableCell>
                <TableCell>
                  <Badge variant="outline">Actif</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ndiaye.fam@example.com
                </TableCell>
                <TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
