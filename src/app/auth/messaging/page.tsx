
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MessagingPage() {
  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Messagerie</h1>
            <p className="text-muted-foreground">Communiquez avec les utilisateurs et gérez les conversations.</p>
        </div>
        <Card className='text-center'>
            <CardHeader>
                <CardTitle>Fonctionnalité en cours de développement</CardTitle>
                <CardDescription>
                    Cet espace est destiné à devenir un centre de messagerie complet.
                </CardDescription>
            </CardHeader>
             <CardContent className="flex flex-col items-center gap-4">
                <p>Pour le moment, toutes les communications directes avec les utilisateurs se font via le système de tickets de support.</p>
                <Button asChild>
                    <Link href="/auth/support">Aller aux Tickets de Support</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
