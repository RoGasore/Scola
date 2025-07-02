
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Trash2, Upload, LoaderCircle } from "lucide-react";

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
import { getLevels, getClassesForLevel, getSectionsForSecondary, getOptionsForHumanites } from '@/lib/school-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const levels = getLevels();
const sections = getSectionsForSecondary();
const options = getOptionsForHumanites();

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

const generateMatricule = (values: z.infer<typeof formSchema>) => {
    const school = "SG";
    const year = new Date().getFullYear().toString().slice(-2);
    const roleCode = "E";
    const sequence = Math.floor(1 + Math.random() * 998).toString().padStart(3, '0');

    let classIdentifier = '';
    const level = values.level;
    const classe = values.class;

    if (level === 'Maternelle' || level === 'Primaire') {
        const classNum = classe.replace(/\D/g, '');
        classIdentifier = level.charAt(0) + classNum;
    } else if (level === 'Secondaire') {
        if (values.section === 'Éducation de base') {
            const classNum = classe.replace(/\D/g, '');
            classIdentifier = `S${classNum}B`;
        } else if (values.section === 'Humanités') {
            const classNum = classe.replace(/\D/g, '');
            const option = values.option || '';
            const optionCode = option.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
            classIdentifier = `S${optionCode}${classNum}`;
        }
    }
    
    return `${school}${year}-${classIdentifier}-${roleCode}${sequence}`;
};


export function StudentEnrollmentForm() {
  const [documents, setDocuments] = React.useState<Array<{ file: File; description: string }>>([]);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [credentials, setCredentials] = React.useState<{ matricule: string; password: string } | null>(null);

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
    setIsSubmitting(true);
    
    setTimeout(() => {
        const generatedMatricule = generateMatricule(values);
        const generatedPassword = Math.random().toString(36).slice(-8);

        console.log("New Student:", { ...values, matricule: generatedMatricule, password: generatedPassword, documents, photo: photoPreview ? 'Photo Selected' : 'No Photo' });
        
        setCredentials({ matricule: generatedMatricule, password: generatedPassword });
        setIsSubmitting(false);
    }, 1500);
  };

  const handleDialogClose = () => {
    setCredentials(null);
    form.reset();
    setDocuments([]);
    setPhotoPreview(null);
  };
  
  const selectedLevel = form.watch("level");
  const selectedSection = form.watch("section");
  const selectedOption = form.watch("option");

  const availableClasses = React.useMemo(() => {
      return getClassesForLevel(selectedLevel, selectedSection, selectedOption);
  }, [selectedLevel, selectedSection, selectedOption]);


  React.useEffect(() => {
    form.setValue("class", "");
    if(selectedLevel !== 'Secondaire') {
        form.setValue("section", "");
        form.setValue("option", "");
    }
  }, [selectedLevel, form]);

  React.useEffect(() => {
     if(selectedSection !== 'Humanités') {
        form.setValue("option", "");
     }
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
                <FormField control={form.control} name="class" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLevel || availableClasses.length === 0}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner la classe" /></SelectTrigger></FormControl>
                        <SelectContent>{availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
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
                          <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
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
            
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Inscrire l'élève
            </Button>
          </form>
        </Form>
      </ScrollArea>
      <AlertDialog open={!!credentials} onOpenChange={(open) => !open && handleDialogClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inscription Terminée !</AlertDialogTitle>
            <AlertDialogDescription>
              Les informations de connexion pour {form.getValues('firstName')} {form.getValues('lastName')} ont été générées. 
              Un e-mail simulé a été envoyé à l'utilisateur. Veuillez noter ces informations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2 text-sm bg-muted p-4 rounded-md border">
              <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Matricule :</span>
                  <span className="font-mono">{credentials?.matricule}</span>
              </div>
              <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Mot de passe :</span>
                  <span className="font-mono">{credentials?.password}</span>
              </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>Fermer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
