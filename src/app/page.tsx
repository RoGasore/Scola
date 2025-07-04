
'use client'

import { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { LifeBuoy, Package2 } from 'lucide-react';
import { SupportDialog } from '@/components/support-dialog';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
          <div className="mx-auto grid w-[380px] gap-8">
            <div className="grid gap-2 text-center">
              <div className="flex items-center justify-center gap-2 font-semibold text-2xl">
                <Package2 className="h-7 w-7 text-primary"/>
                <h1 className="font-bold">ScolaGest</h1>
              </div>
              <p className="text-balance text-muted-foreground">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </div>
            <LoginForm />
          </div>
      </div>
      <Button 
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        onClick={() => setIsSupportDialogOpen(true)}
        size="icon"
      >
        <LifeBuoy className="h-6 w-6" />
        <span className="sr-only">Support</span>
      </Button>
      <SupportDialog 
        open={isSupportDialogOpen} 
        onOpenChange={setIsSupportDialogOpen}
        user={{ name: "Visiteur", email: "visitor@scolagest.com", role: "Non-connecté" }}
      />
    </>
  );
}
