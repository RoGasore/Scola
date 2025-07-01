import { LoginForm } from '@/components/login-form';
import { Package2 } from 'lucide-react';

export default function LoginPage() {
  return (
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
  );
}
