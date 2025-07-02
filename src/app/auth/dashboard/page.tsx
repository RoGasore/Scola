
'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, TrendingUp, FileSignature, ClipboardList, Send, Paperclip, Trash2, Eye } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState, useMemo, useRef } from 'react';
import * as RechartsPrimitive from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, getDaysInMonth, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const generateDailyData = (monthDate, dataKey, min, max) => {
  const daysInMonth = getDaysInMonth(monthDate);
  const data = [];
  for (let i = 1; i <= daysInMonth; i++) {
    data.push({
      jour: i,
      [dataKey]: parseFloat((Math.random() * (max - min) + min).toFixed(1))
    });
  }
  return data;
};

const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
        value: date.toISOString(),
        label: format(date, 'MMMM yyyy', { locale: fr })
    };
});

const CustomTooltip = ({ active, payload, label, dataKey, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="label text-sm text-muted-foreground">{`Jour ${label}`}</p>
        <p className="intro text-base font-bold text-primary">{`${dataKey}: ${payload[0].value}${unit}`}</p>
      </div>
    );
  }
  return null;
};

const pastCommuniques = [
  {
    id: 'COM001',
    subject: "Rappel : Réunion Parents-Professeurs",
    recipients: ['Parents'],
    date: format(subDays(new Date(), 2), 'dd/MM/yyyy'),
    status: { read: 85, unread: 15 },
    content: "Ceci est un rappel pour la réunion parents-professeurs qui aura lieu ce vendredi. Votre présence est vivement souhaitée pour discuter des progrès de votre enfant.",
    attachments: [{ name: 'Ordre_du_jour.pdf', size: '128 KB' }],
    comments: [
      { user: 'Parent de Léo Dubois', text: 'Bien reçu, merci. Serons-nous en mesure de rencontrer le professeur de mathématiques ?', time: 'il y a 2h' },
      { user: 'Direction', text: 'Oui, tous les professeurs titulaires seront disponibles.', time: 'il y a 1h' },
    ]
  },
  {
    id: 'COM002',
    subject: "Information : Journée sportive annuelle",
    recipients: ['Élèves', 'Parents'],
    date: format(subDays(new Date(), 10), 'dd/MM/yyyy'),
    status: { read: 92, unread: 8 },
    content: "La journée sportive annuelle se tiendra le 30 juillet. N'oubliez pas vos tenues de sport ! Des médailles seront décernées aux vainqueurs.",
    attachments: [],
    comments: []
  },
  {
    id: 'COM003',
    subject: "Devoirs de vacances - Classe de 6ème Primaire",
    recipients: ['Élèves'],
    date: format(subDays(new Date(), 25), 'dd/MM/yyyy'),
    status: { read: 65, unread: 35 },
    content: "Veuillez trouver ci-joint les devoirs de vacances pour toutes les matières principales. La remise est prévue pour le premier jour de la rentrée.",
    attachments: [{ name: 'Devoirs_6e_Primaire.docx', size: '45 KB' }],
    comments: []
  },
];


export default function Dashboard() {
  const { toast } = useToast();
  const [gradesMonth, setGradesMonth] = useState(new Date().toISOString());
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().toISOString());

  const gradesData = useMemo(() => generateDailyData(new Date(gradesMonth), 'note', 10, 18), [gradesMonth]);
  const attendanceData = useMemo(() => generateDailyData(new Date(attendanceMonth), 'présence', 85, 99), [attendanceMonth]);
  
  const [message, setMessage] = useState('');
  const [audiences, setAudiences] = useState({
    parents: false,
    eleves: false,
    professeurs: false,
  });
  
  const [attachedFiles, setAttachedFiles] = useState<{name: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCommunique, setSelectedCommunique] = useState<(typeof pastCommuniques)[0] | null>(null);

  const handleAudienceChange = (audience: keyof typeof audiences) => {
    setAudiences(prev => ({ ...prev, [audience]: !prev[audience] }));
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le message ne peut pas être vide.' });
      return;
    }
    const selectedAudiences = Object.entries(audiences)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key);

    if (selectedAudiences.length === 0) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner au moins un destinataire.' });
      return;
    }

    console.log('Sending message:', message, 'to', selectedAudiences, 'with files:', attachedFiles);
    toast({
      title: 'Communiqué envoyé !',
      description: `Votre message a bien été envoyé à : ${selectedAudiences.join(', ')}.`,
      className: "bg-green-500 text-white",
    });
    setMessage('');
    setAudiences({ parents: false, eleves: false, professeurs: false });
    setAttachedFiles([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({ name: file.name }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
  };
  
  const readStatsData = selectedCommunique ? [
    { name: 'Lus', value: selectedCommunique.status.read, fill: 'hsl(var(--primary))' },
    { name: 'Non Lus', value: selectedCommunique.status.unread, fill: 'hsl(var(--muted))' },
  ] : [];


  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2/20</div>
            <p className="text-xs text-muted-foreground">+0.5 depuis le dernier trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présence moyenne</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">+2% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations à venir</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Dans les 7 prochains jours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux Devoirs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">À rendre cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-4">
            <Card>
              <CardHeader>
                  <CardTitle>Nouveau Communiqué</CardTitle>
                  <CardDescription>Rédigez et envoyez un message aux groupes sélectionnés.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <div className="border rounded-md">
                      <div className="p-2 border-b">
                          <p className="text-xs text-muted-foreground">Un éditeur de texte riche sera bientôt disponible.</p>
                      </div>
                      <Textarea 
                        placeholder="Écrivez votre message ici..." 
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-none"
                      />
                  </div>
                  <div className="grid gap-3">
                      <Label>Pièces jointes</Label>
                      <Input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Paperclip className="mr-2 h-4 w-4" />
                          Joindre des fichiers
                      </Button>
                      {attachedFiles.length > 0 && (
                          <div className="space-y-2">
                              {attachedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                                      <span>{file.name}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(file.name)}>
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
                  <div className="grid gap-3">
                      <Label>Destinataires</Label>
                      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-parents" checked={audiences.parents} onCheckedChange={() => handleAudienceChange('parents')} />
                              <Label htmlFor="dest-parents" className="cursor-pointer">Parents</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-eleves" checked={audiences.eleves} onCheckedChange={() => handleAudienceChange('eleves')} />
                              <Label htmlFor="dest-eleves" className="cursor-pointer">Élèves</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Checkbox id="dest-professeurs" checked={audiences.professeurs} onCheckedChange={() => handleAudienceChange('professeurs')} />
                              <Label htmlFor="dest-professeurs" className="cursor-pointer">Professeurs</Label>
                          </div>
                      </div>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSend}>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le Communiqué
                  </Button>
              </CardFooter>
            </Card>
        </div>

        <div className="xl:col-span-1 grid gap-4">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Évolution des notes</CardTitle>
                    </div>
                    <Select value={gradesMonth} onValueChange={setGradesMonth}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="pl-2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={gradesData}>
                        <defs>
                            <linearGradient id="colorGrades" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis domain={[10, 20]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                        <Tooltip content={<CustomTooltip dataKey="Note Moyenne" unit="/20" />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}/>
                        <Area type="monotone" dataKey="note" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorGrades)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Taux de présence</CardTitle>
                    </div>
                     <Select value={attendanceMonth} onValueChange={setAttendanceMonth}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="pl-2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                        <defs>
                            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip content={<CustomTooltip dataKey="Présence" unit="%" />} cursor={{ fill: 'hsl(var(--chart-2) / 0.1)' }} />
                        <Area type="monotone" dataKey="présence" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>

      <Sheet onOpenChange={(open) => !open && setSelectedCommunique(null)}>
        <Card>
          <CardHeader>
            <CardTitle>Historique des Communiqués</CardTitle>
            <CardDescription>Consultez les messages envoyés précédemment et leurs statistiques.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Destinataires</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Taux de lecture</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastCommuniques.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="font-medium">{comm.subject}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {comm.recipients.map(r => <Badge key={r} variant="secondary">{r}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{comm.date}</TableCell>
                    <TableCell className="hidden sm:table-cell">{comm.status.read}%</TableCell>
                    <TableCell className="text-right">
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCommunique(comm)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Détails
                        </Button>
                      </SheetTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedCommunique && (
          <SheetContent className="w-full sm:max-w-3xl">
            <SheetHeader>
              <SheetTitle>{selectedCommunique.subject}</SheetTitle>
              <SheetDescription>
                Envoyé le {selectedCommunique.date} à : {selectedCommunique.recipients.join(', ')}
              </SheetDescription>
            </SheetHeader>
            <Tabs defaultValue="content" className="mt-4">
              <TabsList>
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="comments">Commentaires ({selectedCommunique.comments.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="py-4">
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-sm space-y-4">
                  <p>{selectedCommunique.content}</p>
                  {selectedCommunique.attachments.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Pièces jointes :</h4>
                      <ul className="list-disc pl-5">
                        {selectedCommunique.attachments.map((file, i) => (
                          <li key={i}>
                            <a href="#" className="text-primary hover:underline">{file.name} ({file.size})</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="stats" className="py-4 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Taux de lecture</h4>
                  <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                          <Pie data={readStatsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                              {readStatsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                          </Pie>
                          <RechartsPrimitive.Tooltip />
                          <RechartsPrimitive.Legend />
                      </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Activité de lecture (dernières 24h)</h4>
                   <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={[{name: 'Activité', lectures: 45}]}>
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="lectures" fill="hsl(var(--primary))" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="comments" className="py-4 space-y-4">
                {selectedCommunique.comments.length > 0 ? (
                  selectedCommunique.comments.map((comment, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="font-semibold">{comment.user}:</div>
                      <div className="text-muted-foreground">{comment.text} <span className="text-xs">({comment.time})</span></div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucun commentaire pour ce communiqué.</p>
                )}
              </TabsContent>
            </Tabs>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}

    