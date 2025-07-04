
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AuthorityDashboard() {
  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Espace Autorité</h1>
            <p className="text-muted-foreground">Bienvenue sur votre espace de supervision.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Fonctionnalités à venir</CardTitle>
                <CardDescription>Cet espace est en cours de développement.</CardDescription>
            </CardHeader>
             <CardContent>
                <p>Les fonctionnalités pour les autorités, telles que l'approbation des communiqués, seront bientôt disponibles ici.</p>
            </CardContent>
        </Card>
    </div>
  );
}
