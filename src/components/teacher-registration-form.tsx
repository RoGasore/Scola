"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";

export function TeacherRegistrationForm() {
  return (
    <div className="py-4">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <form className="grid gap-6 px-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Staff Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Jane Smith" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="staff@example.com" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 ... " required />
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Role and Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Sales Manager" required />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Add Staff Member</Button>
        </form>
      </ScrollArea>
    </div>
  );
}
