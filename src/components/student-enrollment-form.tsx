
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Trash2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Le nom de famille est requis." }),
  studentEmail: z.string().email({ message: "Adresse e-mail invalide." }).optional().or(z.literal("")),
  studentPhone: z.string().optional(),
  dob: z.date({ required_error: "La date de naissance est requise." }),
  pob: z.string().min(1, { message: "Le lieu de naissance est requis." }),
  address: z.string().min(1, { message: "L'adresse est requise." }),
  parentName: z.string().min(1, { message: "Le nom du parent est requis." }),
  parentPhone: z.string().min(1, { message: "Le téléphone du parent est requis." }),
  parentEmail: z.string().email({ message: "Adresse e-mail invalide." }).optional().or(z.literal("")),
  level: z.string({ required_error: "Le niveau est requis." }),
  class: z.string().min(1, { message: "La classe est requise." }),
  section: z.string().optional(),
  option: z.string().optional(),
  status: z.string({ required_error: "Le statut est requis." }),
}).refine(data => {
  if (data.level === 'Secondaire') return !!data.section;
  return true;
}, {
  message: "Le cycle est requis pour le niveau secondaire.",
  path: ["section"],
}).refine(data => {
  if (data.level === 'Secondaire' && data.section === 'Humanités') return !!data.option;
  return true;
}, {
  message: "L'option est requise pour le cycle humanités.",
  path: ["option"],
});


export function StudentEnrollmentForm() {
  const [documents, setDocuments] = React.useState<Array<{ file: File; description: string }>>([]);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      studentEmail: "",
      studentPhone: "",
      pob: "",
      address: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      section: "",
      option: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ ...values, documents, photo: photoPreview ? 'Photo Selected' : 'No Photo' });
    toast({
      title: "Inscription réussie",
      description: "L'élève a été ajouté au système avec succès.",
      className: "bg-green-500 text-white",
    });
    form.reset();
    setDocuments([]);
    setPhotoPreview(null);
  };
  
  const selectedLevel = form.watch("level");
  const selectedSection = form.watch("section");

  React.useEffect(() => {
    form.setValue("class", "");
    form.setValue("section", "");
    form.setValue("option", "");
  }, [selectedLevel, form]);

  React.useEffect(() => {
     form.setValue("option", "");
  }, [selectedSection, form]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille de la photo ne doit pas dépasser 2 Mo.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 px-4">
            
            <div className="grid gap-4">
              <h3 className="font-semibold text-lg">Informations Personnelles de l'Élève</h3>
              
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || undefined} alt="Avatar de l'élève" />
                  <AvatarFallback className="text-3xl">
                    {form.watch("firstName")?.[0] || "?"}
                    {form.watch("lastName")?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Joindre une photo
                  </Button>
                  <Input 
                    ref={photoInputRef}
                    id="photo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/jpg" 
                    onChange={handlePhotoChange}
                  />
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG. Max 2Mo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl><Input placeholder="Moïse" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="middleName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post-nom (optionnel)</FormLabel>
                    <FormControl><Input placeholder="Tshombe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input placeholder="Kapenda" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="studentEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail de l'élève (optionnel)</FormLabel>
                    <FormControl><Input type="email" placeholder="moise.kapenda@example.cd" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="studentPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone de l'élève (optionnel)</FormLabel>
                    <FormControl><Input type="tel" placeholder="+243 81 234 5678" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de naissance</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-input", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1990-01-01")} initialFocus locale={fr} captionLayout="dropdown-buttons" fromYear={1990} toYear={new Date().getFullYear()} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="pob" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de naissance</FormLabel>
                    <FormControl><Input placeholder="Kinshasa" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse du domicile</FormLabel>
                    <FormControl><Input placeholder="123 Av. des Huileries, Gombe, Kinshasa" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <Separator />
            
            <div className="grid gap-4">
              <h3 className="font-semibold text-lg">Informations des Parents / Tuteurs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="parentName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet du parent/tuteur</FormLabel>
                    <FormControl><Input placeholder="Marie-Claire Kalonji" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="parentPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone du parent</FormLabel>
                    <FormControl><Input type="tel" placeholder="+243 99 876 5432" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="parentEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail du parent (optionnel)</FormLabel>
                    <FormControl><Input type="email" placeholder="parent@example.cd" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
            </div>
            
            <Separator />

            <div className="grid gap-4">
              <h3 className="font-semibold text-lg">Informations Scolaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="level" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le niveau" /></SelectTrigger></FormControl>
                      <SelectContent>{levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                {selectedLevel && (
                   <FormField control={form.control} name="class" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLevel}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner la classe" /></SelectTrigger></FormControl>
                        <SelectContent>{(classesByLevel[selectedLevel as keyof typeof classesByLevel] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>

              {selectedLevel === 'Secondaire' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="section" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le cycle" /></SelectTrigger></FormControl>
                        <SelectContent>{sections.map(section => <SelectItem key={section} value={section}>{section}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {selectedSection === 'Humanités' && (
                    <FormField control={form.control} name="option" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={selectedSection !== 'Humanités'}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner l'option" /></SelectTrigger></FormControl>
                          <SelectContent>{(optionsBySection['Humanités'] || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>
              )}
              
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut de l'inscription</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le statut" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Transféré">Transféré</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
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
        </Form>
      </ScrollArea>
    </div>
  );
}
