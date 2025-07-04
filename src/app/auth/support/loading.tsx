import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function SupportLoading() {
  const skeletonRows = Array(8).fill(0);

  return (
    <div className="flex flex-col gap-6">
       <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
