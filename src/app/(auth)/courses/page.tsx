import { File, PlusCircle, MoreHorizontal, ListFilter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'

const orders = [
  { id: '#3210', customer: 'Olivia Martin', status: 'Fulfilled', date: 'February 20, 2024', amount: '$250.00' },
  { id: '#3209', customer: 'Ava Johnson', status: 'Pending', date: 'January 5, 2024', amount: '$150.00' },
  { id: '#3208', customer: 'Liam Smith', status: 'Fulfilled', date: 'December 12, 2023', amount: '$350.50' },
  { id: '#3207', customer: 'Noah Brown', status: 'Cancelled', date: 'November 2, 2023', amount: '$89.99' },
  { id: '#3206', customer: 'Emma Garcia', status: 'Fulfilled', date: 'October 15, 2023', amount: '$200.00' },
  { id: '#3205', customer: 'James Wilson', status: 'Pending', date: 'September 28, 2023', amount: '$75.20' },
  { id: '#3204', customer: 'Sophia Miller', status: 'Fulfilled', date: 'August 21, 2023', amount: '$120.00' },
  { id: '#3203', customer: 'Isabella Davis', status: 'Fulfilled', date: 'July 10, 2023', amount: '$300.00' },
];

export default function CoursesPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled" className="hidden sm:flex">Cancelled</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Fulfilled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Cancelled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Order
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Manage your store orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-12 w-12 sm:w-auto">
                    <Checkbox aria-label="Select all" />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox aria-label={`Select row ${index + 1}`} />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                       <Badge variant="outline" className={
                        order.status === 'Fulfilled' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-8</strong> of <strong>32</strong> orders
            </div>
            <div className="ml-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
