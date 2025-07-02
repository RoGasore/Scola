import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';

export default function StudentGradesLoading() {
  const skeletonCourses = Array(3).fill(0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full sm:w-1/2" />
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4">
        {skeletonCourses.map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}
