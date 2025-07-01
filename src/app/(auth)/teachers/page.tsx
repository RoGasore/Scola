import { File, PlusCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TeacherRegistrationForm } from '@/components/teacher-registration-form'

export default function TeachersPage() {
  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Professeurs</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exporter</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un professeur</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Enregistrer un nouveau professeur</SheetTitle>
                <SheetDescription>
                  Remplissez le formulaire pour ajouter un nouveau professeur au système.
                </SheetDescription>
              </SheetHeader>
              <TeacherRegistrationForm />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Annuaire des professeurs</CardTitle>
          <CardDescription>
            Gérez vos professeurs et leurs affectations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Section principale</TableHead>
                <TableHead className="hidden sm:table-cell">Cours enseignés</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Marie Curie</TableCell>
                <TableCell className="hidden md:table-cell">m.curie@scolagest.edu</TableCell>
                <TableCell><Badge variant="outline">Secondaire</Badge></TableCell>
                <TableCell className="hidden sm:table-cell">Physique, Chimie</TableCell>
                <TableCell>
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
                      <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-medium">Albert Einstein</TableCell>
                <TableCell className="hidden md:table-cell">a.einstein@scolagest.edu</TableCell>
                <TableCell><Badge variant="outline">Secondaire</Badge></TableCell>
                <TableCell className="hidden sm:table-cell">Mathématiques</TableCell>
                <TableCell>
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
