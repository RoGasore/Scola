import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function StudentProfileLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="relative h-32 md:h-48 bg-muted rounded-t-lg">
            <Skeleton className="w-full h-full" />
        </CardHeader>
        <CardContent className="relative pt-16">
          <div className="absolute left-6 -top-12">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2 mt-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
            </div>
             <div className="flex gap-2 w-full md:w-auto">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          <Separator className="my-6" />

          <div className="flex border-b">
            <Skeleton className="h-10 w-24 mr-4" />
            <Skeleton className="h-10 w-24 mr-4" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-full" /></div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-6 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-6 w-full" /></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
