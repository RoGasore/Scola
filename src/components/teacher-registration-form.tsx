
"use client";

import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Trash2, Upload, PlusCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Label } from '@/components/ui/label';

const levels = ['Maternelle', 'Primaire', 'Secondaire'];
const classesByLevel = {
  Maternelle: ['1ère Maternelle', '2ème Maternelle', '3ème Maternelle'],
  Primaire: ['1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'],
  Secondaire: ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'],
};
const coursesByLevel = {
    Maternelle: ['Psychomotricité', 'Éveil Artistique', 'Langage'],
    Primaire: ['Lecture et Écriture', 'Mathématiques de Base', 'Découverte du Monde'],
    Secondaire: ['Mathématiques', 'Physique', 'Chimie', 'Français', 'Anglais', 'Histoire', 'Géographie', 'Biologie'],
}
const sections = ['Éducation de base', 'Humanités'];
const optionsBySection = {
  'Humanités': ['Latin-Grec', 'Sciences Économiques', 'Électricité', 'Biochimie', 'Arts', 'Général', 'Numérique', 'Sciences de la Vie'],
};

const assignmentSchema = z.object({
  level: z.string().min(1, "Niveau requis"),
  class: z.string().min(1, "Classe requise"),
  course: z.string().min(1, "Cours requis"),
  section: z.string().optional(),
  option: z.string().optional(),
});
type Assignment = z.infer<typeof assignmentSchema>;

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Le nom de famille est requis." }),
  email: z.string().min(1, { message: "L'adresse e-mail est requise." }).email({ message: "Adresse e-mail invalide." }),
  phone: z.string().min(1, { message: "Le numéro de téléphone est requis." }),
  experience: z.string().optional(),
  assignments: z.array(assignmentSchema).min(1, { message: "Au moins une assignation est requise." }),
});


export function TeacherRegistrationForm() {
  const [documents, setDocuments] = React.useState<Array<{ file: File; description: string }>>([]);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [currentAssignment, setCurrentAssignment] = React.useState<Partial<Assignment>>({});
  const [availableClasses, setAvailableClasses] = React.useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: "",
      assignments: [],
    },
  });
  
  const selectedAssignmentLevel = currentAssignment.level;
  const selectedAssignmentSection = currentAssignment.section;

  React.useEffect(() => {
    if (selectedAssignmentLevel) {
      setAvailableClasses(classesByLevel[selectedAssignmentLevel as keyof typeof classesByLevel] || []);
      setAvailableCourses(coursesByLevel[selectedAssignmentLevel as keyof typeof coursesByLevel] || []);
    } else {
      setAvailableClasses([]);
      setAvailableCourses([]);
    }
    setCurrentAssignment(prev => ({...prev, class: '', course: '', option: ''}));
  }, [selectedAssignmentLevel]);

  React.useEffect(() => {
    setCurrentAssignment(prev => ({...prev, option: ''}));
  }, [selectedAssignmentSection])


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ ...values, documents, photo: photoPreview ? 'Photo Selected' : 'No Photo' });
    toast({
      title: "Enregistrement réussi",
      description: "Le professeur a été ajouté au système avec succès.",
      className: "bg-green-500 text-white",
    });
    form.reset();
    setDocuments([]);
    setPhotoPreview(null);
    setCurrentAssignment({});
  };
  
  const handleAddAssignment = () => {
    if (currentAssignment.level === 'Secondaire') {
      if (!currentAssignment.section) {
        toast({ variant: "destructive", title: "Assignation incomplète", description: "Veuillez sélectionner un cycle pour le niveau secondaire." });
        return;
      }
      if (currentAssignment.section === 'Humanités' && !currentAssignment.option) {
        toast({ variant: "destructive", title: "Assignation incomplète", description: "Veuillez sélectionner une option pour le cycle Humanités." });
        return;
      }
    }

    const result = assignmentSchema.safeParse(currentAssignment);
    if (result.success) {
      const newAssignment = result.data;
      const currentAssignments = form.getValues("assignments");
      
      const isDuplicate = currentAssignments.some(a => 
            a.level === newAssignment.level && 
            a.class === newAssignment.class && 
            a.course === newAssignment.course &&
            a.section === newAssignment.section &&
            a.option === newAssignment.option
      );

      if (!isDuplicate) {
        form.setValue("assignments", [...currentAssignments, newAssignment]);
        setCurrentAssignment({
            level: currentAssignment.level,
            section: currentAssignment.section,
        });
      } else {
         toast({
          variant: "destructive",
          title: "Assignation en double",
          description: "Cette assignation existe déjà pour ce professeur.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Assignation incomplète",
        description: "Veuillez sélectionner un niveau, une classe et un cours.",
      });
    }
  };

  const handleRemoveAssignment = (index: number) => {
    const currentAssignments = form.getValues("assignments");
    form.setValue("assignments", currentAssignments.filter((_, i) => i !== index));
  };
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: "destructive", title: "Fichier trop volumineux", description: "La taille de la photo ne doit pas dépasser 2 Mo." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
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
              <h3 className="font-semibold text-lg">Informations Personnelles</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || undefined} alt="Avatar prof" />
                  <AvatarFallback className="text-3xl">
                    {form.watch("firstName")?.[0] || "P"}
                    {form.watch("lastName")?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Joindre une photo</Button>
                  <Input ref={photoInputRef} id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange}/>
                  <p className="text-xs text-muted-foreground">PNG, JPG. Max 2Mo.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl><Input placeholder="Jean-Luc" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="middleName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post-nom (optionnel)</FormLabel>
                    <FormControl><Input placeholder="Muntu" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input placeholder="Picard" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="prof@example.cd" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input type="tel" placeholder="+243 81 234 5678" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>

            <Separator />
            
            <div className="grid gap-4">
              <h3 className="font-semibold text-lg">Expérience et Qualifications</h3>
              <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expériences passées (optionnel)</FormLabel>
                    <FormControl><Textarea placeholder="Décrivez les expériences professionnelles pertinentes..." {...field} rows={5} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <div className="grid gap-2">
                <Label htmlFor="documents-upload">Diplômes et attestations</Label>
                <Input id="documents-upload" type="file" multiple onChange={handleFileChange} className="bg-input" />
                <p className="text-sm text-muted-foreground">Formats : PDF, JPG, PNG.</p>
              </div>
              {documents.length > 0 && (
                <div className="space-y-3 pt-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border p-3 rounded-lg bg-muted/40">
                      <div className="flex-1 grid gap-2">
                        <p className="text-sm font-semibold truncate" title={doc.file.name}>{doc.file.name}</p>
                        <Input type="text" placeholder="Description (ex: Diplôme de Licence)" value={doc.description} onChange={(e) => handleDescriptionChange(index, e.target.value)} className="bg-background"/>
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveFile(index)} className="w-full sm:w-auto"><Trash2 className="h-4 w-4 sm:mr-2" /><span className="sm:inline">Supprimer</span></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">Assignations Pédagogiques</h3>
                        <p className="text-sm text-muted-foreground">Définissez les cours que ce professeur enseignera.</p>
                    </div>
                </div>
                <FormField control={form.control} name="assignments" render={() => (
                    <FormItem>
                        {form.getValues("assignments").length > 0 && (
                             <div className="space-y-2">
                                <FormLabel>Assignations actuelles</FormLabel>
                                <div className="flex flex-wrap gap-2">
                                {form.getValues("assignments").map((assign, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                                        <span>{`${assign.level} / ${assign.class}${assign.section ? ` / ${assign.section}` : ''}${assign.option ? ` / ${assign.option}` : ''} - ${assign.course}`}</span>
                                        <button type="button" onClick={() => handleRemoveAssignment(index)} className="rounded-full hover:bg-muted-foreground/20 p-0.5"><X className="h-3 w-3" /></button>
                                    </Badge>
                                ))}
                                </div>
                            </div>
                        )}
                        <FormMessage className="pt-2" />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg border-dashed">
                    <div className="grid gap-2">
                        <Label>Niveau</Label>
                        <Select onValueChange={(level) => setCurrentAssignment({ level })} value={currentAssignment.level || ''}>
                            <SelectTrigger><SelectValue placeholder="Choisir le niveau..." /></SelectTrigger>
                            <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     {selectedAssignmentLevel === 'Secondaire' && (
                        <div className="grid gap-2">
                            <Label>Cycle</Label>
                            <Select onValueChange={(section) => setCurrentAssignment(prev => ({ ...prev, section, option: '' }))} value={currentAssignment.section || ''}>
                                <SelectTrigger><SelectValue placeholder="Choisir le cycle..." /></SelectTrigger>
                                <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                     )}
                     {selectedAssignmentLevel === 'Secondaire' && selectedAssignmentSection === 'Humanités' && (
                        <div className="grid gap-2">
                            <Label>Option</Label>
                            <Select onValueChange={(option) => setCurrentAssignment(prev => ({...prev, option}))} value={currentAssignment.option || ''}>
                                <SelectTrigger><SelectValue placeholder="Choisir l'option..." /></SelectTrigger>
                                <SelectContent>{(optionsBySection['Humanités'] || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                     )}
                     <div className="grid gap-2">
                        <Label>Classe</Label>
                        <Select onValueChange={(value) => setCurrentAssignment(prev => ({...prev, class: value}))} value={currentAssignment.class || ''} disabled={!selectedAssignmentLevel}>
                            <SelectTrigger><SelectValue placeholder="Choisir la classe..." /></SelectTrigger>
                            <SelectContent>{availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Cours</Label>
                        <Select onValueChange={(value) => setCurrentAssignment(prev => ({...prev, course: value}))} value={currentAssignment.course || ''} disabled={!selectedAssignmentLevel}>
                            <SelectTrigger><SelectValue placeholder="Choisir le cours..." /></SelectTrigger>
                            <SelectContent>{availableCourses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 flex justify-end items-end">
                      <Button type="button" onClick={handleAddAssignment} variant="outline" className="w-full md:w-auto">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Ajouter l'assignation
                      </Button>
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Enregistrer le professeur</Button>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
