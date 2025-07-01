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
            <h3 className="font-semibold text-lg">Informations du Personnel</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nom Complet</Label>
                <Input id="full-name" placeholder="Jeanne Moreau" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input id="email" type="email" placeholder="prof@example.com" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" placeholder="+33 ... " required />
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Rôle et Département</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="department">Département</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un département" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematiques">Mathématiques</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                      <SelectItem value="lettres">Lettres</SelectItem>
                      <SelectItem value="histoire-geo">Histoire-Géographie</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" placeholder="Professeur de Mathématiques" required />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Ajouter un membre du personnel</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
