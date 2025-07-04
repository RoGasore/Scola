
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'

export default function TeacherCommuniquesLoading() {

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-4 flex-wrap">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-32 ml-auto" />
        </CardFooter>
      </Card>
    </div>
  )
}
