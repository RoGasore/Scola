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
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';

export function StudentEnrollmentForm() {
  const [date, setDate] = useState<Date>();
  const [section, setSection] = useState('');
  const [level, setLevel] = useState('');

  const renderClassOptions = () => {
    if (section === 'kindergarten') {
      return ['1ère Maternelle', '2ème Maternelle', '3ème Maternelle'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (section === 'primary') {
      return ['1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (level === 'base') {
      return ['7ème Base', '8ème Base'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (level === 'humanities') {
       return ['1ère Humanités', '2ème Humanités', '3ème Humanités', '4ème Humanités'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    return <SelectItem value="placeholder" disabled>Sélectionnez d'abord la section</SelectItem>;
  }


  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Informations de l'élève</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nom complet</Label>
                <Input id="full-name" placeholder="Nom, Postnom, Prénom" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date de naissance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
            <div className="grid gap-2">
              <Label htmlFor="pob">Lieu de naissance</Label>
              <Input id="pob" placeholder="Ville, Pays" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Adresse e-mail (Facultatif)</Label>
                <Input id="email" type="email" placeholder="eleve@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Numéro de téléphone (WhatsApp)</Label>
                <Input id="phone" type="tel" placeholder="+243 ... "/>
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="previous-school">École précédente</Label>
                <Input id="previous-school" placeholder="Institut Maarif" />
              </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Assignation de classe</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Select onValueChange={setSection}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner la section" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindergarten">Maternelle</SelectItem>
                      <SelectItem value="primary">Primaire</SelectItem>
                      <SelectItem value="secondary">Secondaire</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              {section === 'secondary' && (
                <div className="grid gap-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select onValueChange={setLevel}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le niveau" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Éducation de Base</SelectItem>
                      <SelectItem value="humanities">Humanités</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              { (section === 'secondary' && level === 'humanities') && (
                 <div className="grid gap-2">
                    <Label htmlFor="option">Option</Label>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Sélectionner l'option" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="math-physique">Math-Physique</SelectItem>
                        <SelectItem value="bio-chimie">Bio-Chimie</SelectItem>
                        <SelectItem value="latin-philo">Latin-Philo</SelectItem>
                        <SelectItem value="commerciale">Commerciale</SelectItem>
                        <SelectItem value="electronique">Électronique</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}
            </div>
             <div className="grid gap-2">
                <Label htmlFor="class">Classe</Label>
                 <Select disabled={!section}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner la classe" /></SelectTrigger>
                    <SelectContent>
                      {renderClassOptions()}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Informations des parents</h3>
            <div className="grid gap-2">
              <Label htmlFor="parent-name">Nom complet du parent</Label>
              <Input id="parent-name" placeholder="Nom, Postnom, Prénom" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parent-email">Email du parent</Label>
                <Input id="parent-email" type="email" placeholder="parent@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent-phone">Téléphone du parent (WhatsApp)</Label>
                <Input id="parent-phone" type="tel" placeholder="+243 ... "/>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Inscrire l'élève</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
