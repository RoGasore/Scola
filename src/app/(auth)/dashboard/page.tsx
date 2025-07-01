
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, BookOpen, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

const generateChartData = () => [
  { month: "Jan", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Fév", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Mar", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Avr", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Mai", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Juin", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Juil", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Août", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Sep", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Oct", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Nov", inscriptions: Math.floor(Math.random() * 500) + 100 },
  { month: "Déc", inscriptions: Math.floor(Math.random() * 500) + 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="label text-sm text-muted-foreground">{`${label}`}</p>
        <p className="intro text-base font-bold text-primary">{`${payload[0].value.toLocaleString()} inscriptions`}</p>
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
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground">+1.5% depuis le dernier trimestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+19 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs Maintenant</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 depuis la dernière heure</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inscriptions par mois</CardTitle>
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
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="inscriptions"
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
            <CardTitle>Inscriptions Récentes</CardTitle>
            <CardDescription>265 nouvelles inscriptions ce mois-ci.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="femme" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">Mathématiques</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="homme" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">Physique</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                   <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="femme Asie" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">Histoire de l'Art</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="homme noir" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">William Kim</p>
                  <p className="text-sm text-muted-foreground">will@email.com</p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">Chimie Organique</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="femme hispanique" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sofia Davis</p>
                  <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">Biologie</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
