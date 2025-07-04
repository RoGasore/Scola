
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagingLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Card>
        <CardHeader className="items-center">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <Skeleton className="h-5 w-full max-w-lg" />
            <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
    </div>
  );
}
