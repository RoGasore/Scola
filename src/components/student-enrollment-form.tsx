"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from './ui/scroll-area';

export function StudentEnrollmentForm() {
  const [date, setDate] = useState<Date>();
  const [section, setSection] = useState('');
  const [level, setLevel] = useState('');

  const renderClassOptions = () => {
    if (section === 'kindergarten') {
      return ['1st Kindergarten', '2nd Kindergarten', '3rd Kindergarten'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (section === 'primary') {
      return ['1st Primary', '2nd Primary', '3rd Primary', '4th Primary', '5th Primary', '6th Primary'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (level === 'base') {
      return ['7th Base', '8th Base'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    if (level === 'humanities') {
       return ['1st Humanities', '2nd Humanities', '3rd Humanities', '4th Humanities'].map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '-')}>{c}</SelectItem>)
    }
    return <SelectItem value="placeholder" disabled>Select section first</SelectItem>;
  }


  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Nom, Postnom, Prénom" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pob">Place of Birth</Label>
              <Input id="pob" placeholder="City, Country" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input id="email" type="email" placeholder="student@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number (WhatsApp)</Label>
                <Input id="phone" type="tel" placeholder="+243 ... "/>
              </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="previous-school">Previous School</Label>
                <Input id="previous-school" placeholder="Institut Maarif" />
              </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Class Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Select onValueChange={setSection}>
                    <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindergarten">Kindergarten</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              {section === 'secondary' && (
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select onValueChange={setLevel}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Éducation de Base</SelectItem>
                      <SelectItem value="humanities">Humanités</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              { (section === 'secondary' && level === 'humanities') && (
                 <div className="grid gap-2">
                    <Label htmlFor="option">Option</Label>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="math-physics">Math-Physics</SelectItem>
                        <SelectItem value="biochem">Bio-Chemistry</SelectItem>
                        <SelectItem value="latin-philo">Latin-Philosophy</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}
            </div>
             <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                 <Select disabled={!section}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {renderClassOptions()}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Parent Information</h3>
            <div className="grid gap-2">
              <Label htmlFor="parent-name">Parent's Full Name</Label>
              <Input id="parent-name" placeholder="Nom, Postnom, Prénom" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parent-email">Parent's Email</Label>
                <Input id="parent-email" type="email" placeholder="parent@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent-phone">Parent's Phone (WhatsApp)</Label>
                <Input id="parent-phone" type="tel" placeholder="+243 ... "/>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Enroll Student</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
