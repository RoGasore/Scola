
'use client'

import React from 'react';
import {
  Home,
  PanelLeft,
  GraduationCap,
  MessageSquare,
  Package2,
  Bell,
  Settings,
  Presentation,
  LifeBuoy
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSupportDialogOpen, setIsSupportDialogOpen] = React.useState(false);

  const getLinkClass = (path: string) => {
    return pathname.startsWith(path)
      ? 'bg-muted text-primary'
      : 'text-muted-foreground hover:text-primary';
  };

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/teacher/dashboard" className="flex items-center gap-2 font-semibold">
                 <Package2 className="h-6 w-6 text-primary"/>
                <span>Espace Enseignant</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink href="/teacher/dashboard" icon={Home}>Tableau de bord</NavLink>
                <NavLink href="/teacher/classes" icon={Presentation}>Mes Classes</NavLink>
                <NavLink href="/teacher/notes" icon={GraduationCap}>Saisie des Notes</NavLink>
                <NavLink href="/teacher/communiques" icon={MessageSquare}>Communiqués</NavLink>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsSupportDialogOpen(true)}>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
              </Button>
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
                     <Link href="/teacher/dashboard" className="flex items-center gap-2 font-semibold">
                      <Package2 className="h-6 w-6 text-primary"/>
                      <span>Espace Enseignant</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="/teacher/dashboard" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/teacher/dashboard')}`}><Home className="h-5 w-5" />Tableau de bord</Link>
                    <Link href="/teacher/classes" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/teacher/classes')}`}><Presentation className="h-5 w-5" />Mes Classes</Link>
                    <Link href="/teacher/notes" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/teacher/notes')}`}><GraduationCap className="h-5 w-5" />Saisie des Notes</Link>
                    <Link href="/teacher/communiques" className={`flex items-center gap-4 rounded-xl px-3 py-2 ${getLinkClass('/teacher/communiques')}`}><MessageSquare className="h-5 w-5" />Communiqués</Link>
                </nav>
                <div className="mt-auto">
                   <Button variant="outline" className="w-full justify-start" onClick={() => setIsSupportDialogOpen(true)}>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      Support
                   </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
             <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="homme noir" />
                          <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Jean Dupont</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Settings className="mr-2"/>Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild><Link href="/">Déconnexion</Link></DropdownMenuItem>
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
        user={{ name: "Jean Dupont", role: "Enseignant" }}
      />
    </>
  );
}
