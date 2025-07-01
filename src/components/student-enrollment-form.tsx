"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';

export function StudentEnrollmentForm() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Informations sur l'élève</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nom complet</Label>
                <Input id="full-name" placeholder="Jean Dupont" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date de naissance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-input",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" placeholder="eleve@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" placeholder="+33 ... "/>
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="123 Rue Principale, Paris" />
              </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Détails du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="account-type">Type de compte</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le statut" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Ajouter l'élève</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
