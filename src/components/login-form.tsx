
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Role = 'admin' | 'teacher' | 'student' | 'parent' | 'authority' | 'accountant';
export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switch (role) {
      case 'admin':
        router.push('/auth/dashboard');
        break;
      case 'teacher':
        router.push('/teacher/dashboard');
        break;
      case 'student':
        router.push('/student/dashboard');
        break;
      case 'parent':
        router.push('/parent/dashboard');
        break;
      case 'authority':
        router.push('/authority/dashboard');
        break;
      case 'accountant':
        router.push('/auth/dashboard'); // Assuming accountants go to the general auth dashboard
        break;
      default:
        router.push('/auth/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="role">Je me connecte en tant que</Label>
            <Select onValueChange={(value) => setRole(value as Role)} defaultValue={role}>
                <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="teacher">Professeur</SelectItem>
                    <SelectItem value="student">Élève</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="authority">Autorité</SelectItem>
                    <SelectItem value="accountant">Comptable</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="matricule">Matricule ou Email</Label>
          <Input
            id="matricule"
            type="text"
            placeholder="m@example.com ou SG24-..."
            required
            className="bg-input"
            defaultValue={role === 'admin' ? 'admin@scolagest.com' : 'E24-M1-001'}
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
          <Input id="password" type="password" required className="bg-input" defaultValue="password" />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Se connecter
        </Button>
      </div>
    </form>
  );
}
