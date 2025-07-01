
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Activity, ClipboardCheck, ArrowUpRight, FileSignature, ClipboardList } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

const generateChartData = () => [
  { month: "Jan", note: Math.floor(Math.random() * 4) + 12 },
  { month: "Fév", note: Math.floor(Math.random() * 4) + 13 },
  { month: "Mar", note: Math.floor(Math.random() * 4) + 11 },
  { month: "Avr", note: Math.floor(Math.random() * 4) + 14 },
  { month: "Mai", note: Math.floor(Math.random() * 4) + 15 },
  { month: "Juin", note: Math.floor(Math.random() * 4) + 14 },
];

const recentAssessments = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', subject: 'Mathématiques', grade: '17/20', avatar: 'femme' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', subject: 'Physique', grade: '14/20', avatar: 'homme' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', subject: 'Histoire', grade: '19/20', avatar: 'femme Asie' },
    { name: 'William Kim', email: 'will@email.com', subject: 'Chimie', grade: '12/20', avatar: 'homme noir' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', subject: 'Biologie', grade: '16/20', avatar: 'femme hispanique' },
];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="label text-sm text-muted-foreground">{`${label}`}</p>
        <p className="intro text-base font-bold text-primary">{`Note moyenne: ${payload[0].value}/20`}</p>
      </div>
    );
  }

  return null;
};

export default function Dashboard() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(generateChartData());
  }, []);

  return (
    <>
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Évolution des notes moyennes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
               <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[10, 20]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="note"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
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
    </>
  );
}
