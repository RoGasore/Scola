import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function TeachersLoading() {
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="grid flex-1 items-start gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-36" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80 mt-2" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
