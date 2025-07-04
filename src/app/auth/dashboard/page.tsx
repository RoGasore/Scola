
'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, TrendingUp, FileSignature, ClipboardList, MessageSquare, UserPlus, BookUser, LifeBuoy } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, getDaysInMonth, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getRecentSupportTickets } from '@/services/support';
import type { SupportTicket } from '@/types';

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

const recentActivity = [
    { icon: <UserPlus />, text: "Nouvel élève inscrit : Léo Dubois.", time: "il y a 5 min", user: { name: 'Admin', avatar: 'femme' } },
    { icon: <MessageSquare />, text: "Nouveau commentaire sur le communiqué 'Réunion Parents-Professeurs'.", time: "il y a 2 heures", user: { name: 'Parent de Léo', avatar: 'homme congolais' } },
    { icon: <FileSignature />, text: "Les notes de l'interrogation de Mathématiques ont été publiées.", time: "il y a 8 heures", user: { name: 'M. Dupont', avatar: 'homme noir' } },
    { icon: <BookUser />, text: "Mme. Diallo a été assignée au cours d'Anglais en 1ère.", time: "il y a 1 jour", user: { name: 'Admin', avatar: 'femme' } },
]

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
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      const tickets = await getRecentSupportTickets(5);
      setSupportTickets(tickets);
    }
    fetchTickets();
  }, []);

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

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
         <Card className="xl:col-span-2">
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
            <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Les derniers événements sur la plateforme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                             <AvatarImage src={`https://placehold.co/96x96.png`} data-ai-hint={activity.user.avatar} />
                             <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm">{activity.icon} {activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
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

        <Card>
            <CardHeader>
                <CardTitle>Tickets de Support Récents</CardTitle>
                <CardDescription>Les dernières demandes d'assistance des utilisateurs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {supportTickets.length > 0 ? supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 pt-1">
                            <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none truncate" title={ticket.message}>{ticket.message}</p>
                            <p className="text-xs text-muted-foreground">
                                De: {ticket.pageUrl.split('/').pop()} &middot; {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: fr })}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun ticket de support récent.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
