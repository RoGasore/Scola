"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";

export function TeacherRegistrationForm() {
  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Informations du professeur</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nom complet</Label>
                <Input id="full-name" placeholder="Nom, Postnom, Prénom" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" placeholder="professeur@example.com" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" placeholder="+243 ... " required />
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Assignation de classe et de cours</h3>
            <p className="text-sm text-muted-foreground">La logique d'affectation détaillée sera mise en œuvre. Sélectionnez la section principale pour l'instant.</p>
             <div className="grid gap-2">
                <Label htmlFor="section">Section principale</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Sélectionner la section" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kindergarten">Maternelle</SelectItem>
                    <SelectItem value="primary">Primaire</SelectItem>
                    <SelectItem value="secondary">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Enregistrer le professeur</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
