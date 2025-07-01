import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function StudentsLoading() {
  const skeletonRows = Array(8).fill(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
       <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-8 w-1/2 md:w-1/3" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"><Skeleton className="h-5 w-5" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableHead>
                <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
