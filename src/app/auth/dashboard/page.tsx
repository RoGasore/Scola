
'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, FileSignature, ClipboardList, CalendarCheck, GraduationCap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Brush } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, getDaysInMonth, startOfMonth, addMonths, getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';

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

const recentAssessments = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', subject: 'Mathématiques', grade: '17/20', avatar: 'femme' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', subject: 'Physique', grade: '14/20', avatar: 'homme' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', subject: 'Histoire', grade: '19/20', avatar: 'femme Asie' },
    { name: 'William Kim', email: 'will@email.com', subject: 'Chimie', grade: '12/20', avatar: 'homme noir' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', subject: 'Biologie', grade: '16/20', avatar: 'femme hispanique' },
];

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
  const [gradesMonth, setGradesMonth] = useState(new Date().toISOString());
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().toISOString());

  const gradesData = useMemo(() => generateDailyData(new Date(gradesMonth), 'note', 10, 18), [gradesMonth]);
  const attendanceData = useMemo(() => generateDailyData(new Date(attendanceMonth), 'présence', 85, 99), [attendanceMonth]);
  
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
            <CardTitle>Dernières Évaluations</CardTitle>
            <CardDescription>Notes des dernières évaluations rendues.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentAssessments.map((assessment, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt="Avatar" data-ai-hint={assessment.avatar} />
                    <AvatarFallback>{assessment.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{assessment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {assessment.subject}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-foreground">{assessment.grade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
