
'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, TrendingUp, FileSignature, ClipboardList, Send } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Brush } from 'recharts';
import { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, getDaysInMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";


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

    console.log('Sending message:', message, 'to', selectedAudiences);
    toast({
      title: 'Communiqué envoyé !',
      description: `Votre message a bien été envoyé à : ${selectedAudiences.join(', ')}.`,
      className: "bg-green-500 text-white",
    });
    setMessage('');
    setAudiences({ parents: false, eleves: false, professeurs: false });
  };


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
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Évolution des notes moyennes</CardTitle>
                        <CardDescription>Note moyenne par jour pour le mois sélectionné.</CardDescription>
                    </div>
                    <Select value={gradesMonth} onValueChange={setGradesMonth}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={gradesData}>
                        <defs>
                            <linearGradient id="colorGrades" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="jour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[10, 20]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <Tooltip content={<CustomTooltip dataKey="Note Moyenne" unit="/20" />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}/>
                        <Area type="monotone" dataKey="note" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorGrades)" />
                        <Brush dataKey="jour" height={30} stroke="hsl(var(--primary))" travellerWidth={20} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
                <Link href="/auth/grades" className="absolute inset-0" aria-label="Voir le détail des notes"></Link>
            </Card>

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Taux de présence mensuel</CardTitle>
                        <CardDescription>Présence moyenne par jour pour le mois sélectionné.</CardDescription>
                    </div>
                     <Select value={attendanceMonth} onValueChange={setAttendanceMonth}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={attendanceData}>
                        <defs>
                            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="jour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <Tooltip content={<CustomTooltip dataKey="Présence" unit="%" />} cursor={{ fill: 'hsl(var(--chart-2) / 0.1)' }} />
                        <Area type="monotone" dataKey="présence" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                        <Brush dataKey="jour" height={30} stroke="hsl(var(--chart-2))" travellerWidth={20} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
                 <Link href="/auth/attendance" className="absolute inset-0" aria-label="Voir le détail des présences"></Link>
            </Card>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>Communiqués</CardTitle>
              <CardDescription>Envoyez des messages aux élèves, parents et professeurs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
              <Textarea 
                placeholder="Écrivez votre message ici..." 
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
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
    </div>
  );
}

