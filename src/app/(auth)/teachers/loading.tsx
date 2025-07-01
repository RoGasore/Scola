import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TeachersLoading() {
  return (
    <div className="grid flex-1 items-start gap-4">
      <Skeleton className="h-8 w-36" />
      <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-[300px] w-full" />
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-[300px] w-full" />
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
