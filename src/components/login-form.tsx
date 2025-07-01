"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-input"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="#"
              className="ml-auto inline-block text-sm text-primary/80 hover:text-primary"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" type="password" required className="bg-input" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Se connecter
        </Button>
      </div>
    </form>
  );
}
