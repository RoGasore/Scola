
"use client";

import * as React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Trash2 } from 'lucide-react';
import { Switch } from './ui/switch';
import { getLevels } from '@/lib/school-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const courseSchema = z.object({
  name: z.string().min(1, "Le nom du cours est requis."),
  hours: z.number().min(1, "Le nombre d'heures est requis."),
});

const classSchema = z.object({
  name: z.string(),
  isActive: z.boolean().default(true),
  courses: z.array(courseSchema),
});

const optionSchema = z.object({
  classes: z.record(z.string(), classSchema),
});

const levelSchema = z.object({
  classes: z.record(z.string(), classSchema),
});

const secondarySchema = z.object({
  'Éducation de base': levelSchema,
  'Humanités': z.object({
    options: z.record(z.string(), optionSchema),
  }),
});

const structureSchema = z.object({
  Maternelle: levelSchema,
  Primaire: levelSchema,
  Secondaire: secondarySchema,
});

type CourseManagementFormProps = {
    initialStructure: z.infer<typeof structureSchema>;
    onUpdate: (newStructure: z.infer<typeof structureSchema>) => void;
}

function ClassEditor({ control, classPath }: { control: any, classPath: string }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${classPath}.courses`,
  });

  return (
    <div className='pl-4 border-l-2 ml-4 space-y-4 py-4'>
        <FormField
            control={control}
            name={`${classPath}.isActive`}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Classe Active</FormLabel>
                        <FormMessage />
                    </div>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </FormItem>
            )}
        />
        {fields.map((course, index) => (
            <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6">
                    <FormField
                        control={control}
                        name={`${classPath}.courses.${index}.name`}
                        render={({ field }) => (
                            <FormItem><FormLabel className='sr-only'>Nom du cours</FormLabel><FormControl><Input placeholder="Nom du cours" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                </div>
                <div className="col-span-4">
                    <FormField
                        control={control}
                        name={`${classPath}.courses.${index}.hours`}
                        render={({ field }) => (
                            <FormItem><FormLabel className='sr-only'>Heures</FormLabel><FormControl><Input type="number" placeholder="Heures/sem" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                </div>
                <div className="col-span-2">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', hours: 1 })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un cours
        </Button>
    </div>
  );
}


export function CourseManagementForm({ initialStructure, onUpdate }: CourseManagementFormProps) {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = React.useState<string>(getLevels()[0]);
  const [newOptionName, setNewOptionName] = React.useState('');

  const form = useForm<z.infer<typeof structureSchema>>({
    resolver: zodResolver(structureSchema),
    defaultValues: initialStructure,
  });

  const onSubmit = (values: z.infer<typeof structureSchema>) => {
    onUpdate(values);
    toast({
      title: "Structure Enregistrée",
      description: "La structure scolaire a été mise à jour avec succès.",
      className: "bg-green-500 text-white",
    });
  };

  const addNewOption = () => {
    if (!newOptionName.trim()) {
        toast({ variant: 'destructive', title: 'Nom Invalide', description: 'Veuillez entrer un nom pour la nouvelle option.' });
        return;
    }
    const secondaryYears = ['1ère', '2ème', '3ème', '4ème'];
    const newClasses: Record<string, z.infer<typeof classSchema>> = {};
    secondaryYears.forEach(year => {
        const className = `${year} ${newOptionName}`;
        newClasses[className] = { name: className, isActive: true, courses: [] };
    });

    const currentOptions = form.getValues('Secondaire.Humanités.options');
    form.setValue(`Secondaire.Humanités.options`, {
        ...currentOptions,
        [newOptionName]: { classes: newClasses }
    });
    setNewOptionName('');
  };

  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
                <div className='flex items-center gap-4'>
                    <Select onValueChange={setSelectedLevel} defaultValue={selectedLevel}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Choisir un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                            {getLevels().map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <p className='text-sm text-muted-foreground'>Configurez les classes et les cours pour le niveau sélectionné.</p>
                </div>
                <Separator />

                <div className='space-y-4'>
                    {selectedLevel === 'Maternelle' && (
                        <Accordion type="single" collapsible className="w-full">
                            {Object.keys(form.watch('Maternelle.classes')).map((className) => (
                                <AccordionItem key={className} value={className}>
                                    <AccordionTrigger>{className}</AccordionTrigger>
                                    <AccordionContent>
                                      <ClassEditor control={form.control} classPath={`Maternelle.classes.${className}`} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {selectedLevel === 'Primaire' && (
                         <Accordion type="single" collapsible className="w-full">
                            {Object.keys(form.watch('Primaire.classes')).map((className) => (
                                <AccordionItem key={className} value={className}>
                                    <AccordionTrigger>{className}</AccordionTrigger>
                                    <AccordionContent>
                                      <ClassEditor control={form.control} classPath={`Primaire.classes.${className}`} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {selectedLevel === 'Secondaire' && (
                        <div className='space-y-6'>
                            <Card>
                                <CardHeader><CardTitle>Cycle d'Éducation de Base</CardTitle></CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        {Object.keys(form.watch('Secondaire.Éducation de base.classes')).map((className) => (
                                            <AccordionItem key={className} value={className}>
                                                <AccordionTrigger>{className}</AccordionTrigger>
                                                <AccordionContent>
                                                  <ClassEditor control={form.control} classPath={`Secondaire.Éducation de base.classes.${className}`} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle>Cycle des Humanités</CardTitle>
                                    <CardDescription>Gérez les options et leurs classes respectives.</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className="flex gap-2">
                                        <Input placeholder="Nom de la nouvelle option (ex: Pédagogie)" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
                                        <Button type="button" onClick={addNewOption}><PlusCircle className='mr-2 h-4 w-4' />Ajouter</Button>
                                    </div>
                                    <Separator />
                                    <Accordion type="multiple" className="w-full">
                                        {Object.keys(form.watch('Secondaire.Humanités.options')).map((optionName) => (
                                            <AccordionItem key={optionName} value={optionName}>
                                                <AccordionTrigger className='text-lg font-semibold'>{optionName}</AccordionTrigger>
                                                <AccordionContent>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        {Object.keys(form.watch(`Secondaire.Humanités.options.${optionName}.classes`)).map((className) => (
                                                            <AccordionItem key={className} value={className}>
                                                                <AccordionTrigger>{className}</AccordionTrigger>
                                                                <AccordionContent>
                                                                  <ClassEditor control={form.control} classPath={`Secondaire.Humanités.options.${optionName}.classes.${className}`} />
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

            <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Enregistrer la Structure</Button>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
