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

// These would typically come from a database or a config file
const levels = ['Maternelle', 'Primaire', 'Secondaire'];
const classesByLevel = {
  Maternelle: ['1ère Maternelle', '2ème Maternelle', '3ème Maternelle'],
  Primaire: ['1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'],
  Secondaire: ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'],
};
const sections = ['Éducation de base', 'Humanités'];
const optionsBySection = {
  'Humanités': ['Latin-Grec', 'Sciences Économiques', 'Électricité', 'Biochimie', 'Arts', 'Général', 'Numérique', 'Sciences de la Vie'],
};

export function StudentEnrollmentForm() {
  const [date, setDate] = useState<Date>();
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" placeholder="Jean" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="middle-name">Post-nom</Label>
                <Input id="middle-name" placeholder="Claude" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" placeholder="Dupont" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
               <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="123 Rue Principale, Paris" />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Informations de Contact</h3>
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
          </div>
          
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Informations Scolaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select onValueChange={(value) => { setSelectedLevel(value); setSelectedSection(''); }}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le niveau" /></SelectTrigger>
                    <SelectContent>
                      {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                  </Select>
              </div>
              {selectedLevel && (
                <div className="grid gap-2">
                    <Label htmlFor="class">Classe</Label>
                    <Select disabled={!selectedLevel}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner la classe" /></SelectTrigger>
                        <SelectContent>
                        {(classesByLevel[selectedLevel as keyof typeof classesByLevel] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              )}
            </div>

            {selectedLevel === 'Secondaire' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="section">Cycle</Label>
                    <Select onValueChange={setSelectedSection}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner le cycle" /></SelectTrigger>
                      <SelectContent>
                        {sections.map(section => <SelectItem key={section} value={section}>{section}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>

                {selectedSection === 'Humanités' && (
                  <div className="grid gap-2">
                      <Label htmlFor="option">Option</Label>
                      <Select disabled={selectedSection !== 'Humanités'}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner l'option" /></SelectTrigger>
                          <SelectContent>
                            {(optionsBySection['Humanités'] || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Inscrire l'élève</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
