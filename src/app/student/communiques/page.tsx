'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { getRecentAnnouncements } from '@/services/communiques';
import type { Communique } from '@/types';
import StudentCommuniquesLoading from './loading';

export default function StudentCommuniquesPage() {
  const [announcements, setAnnouncements] = useState<Communique[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const announcementsData = await getRecentAnnouncements('student');
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return <StudentCommuniquesLoading />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communiqués</h1>
        <p className="text-muted-foreground">
          Les dernières annonces et informations importantes de l'école.
        </p>
      </div>
      
      {announcements.length === 0 ? (
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Aucun communiqué pour le moment.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((communique) => (
            <Card key={communique.id} className="hover:border-primary/50 transition-colors">
                 <Link href="#" className="block">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint={communique.author.avatar} />
                                    <AvatarFallback>{communique.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{communique.subject}</CardTitle>
                                    <CardDescription>
                                        Par {communique.author.name} &middot; {communique.date}
                                    </CardDescription>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground mt-1 hidden sm:block" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground line-clamp-2"
                             dangerouslySetInnerHTML={{ __html: communique.content }} />
                        <div className="mt-4 flex gap-2">
                            {communique.recipients.map(r => <Badge key={r} variant="outline">{r}</Badge>)}
                        </div>
                    </CardContent>
                </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
