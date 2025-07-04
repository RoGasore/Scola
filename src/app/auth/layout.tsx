
'use client'

import React from 'react';
import {
  Home,
  PanelLeft,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  CalendarCheck,
  Package2,
  Briefcase,
  MessageSquare,
  Settings,
  FileText,
  LifeBuoy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SupportDialog } from '@/components/support-dialog';

function NavLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getLinkClass = (path: string) => {
    return pathname.startsWith(path)
      ? 'bg-muted text-primary'
      : 'text-muted-foreground hover:text-primary';
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  if (!isMounted) {
    return null; // ou un skeleton/loader
  }

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/auth/dashboard" className="flex items-center gap-2 font-semibold">
                 <Package2 className="h-6 w-6 text-primary"/>
                <span>ScolaGest</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink href="/auth/dashboard" icon={Home}>Tableau de bord Admin</NavLink>
                <NavLink href="/auth/communiques" icon={MessageSquare}>Communiqués</NavLink>
                <NavLink href="/auth/courses" icon={BookOpen}>Cours</NavLink>
                <NavLink href="/auth/students" icon={Users}>Élèves</NavLink>
                <NavLink href="/auth/grades" icon={GraduationCap}>Notes</NavLink>
                <NavLink href="/auth/bulletins" icon={FileText}>Bulletins</NavLink>
                <NavLink href="/auth/attendance" icon={CalendarCheck}>Présences</NavLink>
                <NavLink href="/auth/teachers" icon={Briefcase}>Professeurs</NavLink>
                <NavLink href="/auth/support" icon={LifeBuoy}>Tickets de Support</NavLink>
                <NavLink href="/auth/settings" icon={Settings}>Paramètres</NavLink>
              </nav>
            </div>
            <div className="mt-auto p-4 space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsSupportDialogOpen(true)}>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Contacter le Support
                </Button>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="theme-switch-desktop" 
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeChange}
                    aria-label="Changer de thème"
                  />
                  <Label htmlFor="theme-switch-desktop">Mode Sombre</Label>
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu de navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                     <Link href="/auth/dashboard" className="flex items-center gap-2 font-semibold">
                      <Package2 className="h-6 w-6 text-primary"/>
                      <span>ScolaGest</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="/auth/dashboard" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/dashboard')}`}><Home className="h-5 w-5" />T. de bord Admin</Link>
                    <Link href="/auth/communiques" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/communiques')}`}><MessageSquare className="h-5 w-5" />Communiqués</Link>
                    <Link href="/auth/courses" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/courses')}`}><BookOpen className="h-5 w-5" />Cours</Link>
                    <Link href="/auth/students" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/students')}`}><Users className="h-5 w-5" />Élèves</Link>
                    <Link href="/auth/grades" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/grades')}`}><GraduationCap className="h-5 w-5" />Notes</Link>
                    <Link href="/auth/bulletins" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/bulletins')}`}><FileText className="h-5 w-5" />Bulletins</Link>
                    <Link href="/auth/attendance" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/attendance')}`}><CalendarCheck className="h-5 w-5" />Présences</Link>
                    <Link href="/auth/teachers" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/teachers')}`}><Briefcase className="h-5 w-5" />Professeurs</Link>
                    <Link href="/auth/support" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/support')}`}><LifeBuoy className="h-5 w-5" />Tickets de Support</Link>
                    <Link href="/auth/settings" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/auth/settings')}`}><Settings className="h-5 w-5" />Paramètres</Link>
                </nav>
                 <div className="mt-auto p-4 space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsSupportDialogOpen(true)}>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      Contacter le Support
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="theme-switch-mobile" 
                      checked={theme === 'dark'}
                      onCheckedChange={handleThemeChange}
                      aria-label="Changer de thème"
                    />
                    <Label htmlFor="theme-switch-mobile">Mode Sombre</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="femme" />
                          <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSupportDialogOpen(true)}>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <SupportDialog 
        open={isSupportDialogOpen} 
        onOpenChange={setIsSupportDialogOpen}
        user={{ name: "Admin User", role: "Admin" }}
      />
    </>
  );
}
