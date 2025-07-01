
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

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
  const [documents, setDocuments] = useState<Array<{ file: File; description: string }>>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({ file, description: '' }));
      setDocuments(prevDocs => [...prevDocs, ...newFiles]);
    }
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setDocuments(prevDocs => {
      const newDocs = [...prevDocs];
      newDocs[index].description = description;
      return newDocs;
    });
  };

  const handleRemoveFile = (index: number) => {
    setDocuments(prevDocs => prevDocs.filter((_, i) => i !== index));
  };


  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Informations Personnelles de l'Élève</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" placeholder="Moïse" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="middle-name">Post-nom</Label>
                <Input id="middle-name" placeholder="Tshombe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" placeholder="Kapenda" />
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
                      captionLayout="dropdown-buttons"
                      fromYear={1990}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="place-of-birth">Lieu de naissance</Label>
                <Input id="place-of-birth" placeholder="Kinshasa" />
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="address">Adresse du domicile</Label>
                <Input id="address" placeholder="123 Av. des Huileries, Gombe, Kinshasa" />
              </div>
          </div>

          <Separator />
          
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Informations des Parents / Tuteurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parent-name">Nom complet du parent/tuteur</Label>
                <Input id="parent-name" placeholder="Marie-Claire Kalonji" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent-phone">Téléphone du parent</Label>
                <Input id="parent-phone" type="tel" placeholder="+243 99 876 5432"/>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent-email">Adresse e-mail du parent</Label>
              <Input id="parent-email" type="email" placeholder="parent@example.cd" />
            </div>
          </div>
          
          <Separator />

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
            
            <div className="grid gap-2">
              <Label htmlFor="status">Statut de l'inscription</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Sélectionner le statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="transferred">Transféré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />
          
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Documents Requis</h3>
            <div className="grid gap-2">
              <Label htmlFor="documents-upload">Joindre des documents (bulletins, etc.)</Label>
              <Input id="documents-upload" type="file" multiple onChange={handleFileChange} className="bg-input" />
              <p className="text-sm text-muted-foreground">
                Vous pouvez sélectionner plusieurs fichiers. Formats : PDF, JPG, PNG.
              </p>
            </div>

            {documents.length > 0 && (
              <div className="space-y-4 pt-2">
                <h4 className="font-medium text-sm">Fichiers sélectionnés :</h4>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border p-3 rounded-lg bg-muted/40">
                      <div className="flex-1 grid gap-2">
                        <p className="text-sm font-semibold truncate" title={doc.file.name}>{doc.file.name}</p>
                        <Input
                          type="text"
                          placeholder="Description (ex: Bulletin 1ère semestre)"
                          value={doc.description}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-2" />
                        <span className="sm:inline">Supprimer</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Inscrire l'élève</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
