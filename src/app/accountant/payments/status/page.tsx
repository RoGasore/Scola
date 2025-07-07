'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AcademicYearConfig, Fee, Payment } from '@/types/accounting';
import {
  getAllPayments,
  getAcademicYearConfig,
} from '@/services/accounting'; // Assuming you have these services
import { getAllStudents } from '@/services/students'; // Assuming you have a student service
import { Student } from '@/types'; // Assuming you have a student type

interface StudentPaymentInfo {
  studentId: string;
  name: string;
  class: string;
  totalFeesDue: number;
  totalAmountPaid: number;
  balance: number;
  payments: Payment[];
}

const PaymentStatusPage = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTrimester, setSelectedTrimester] = useState('');
  const [feeType, setFeeType] = useState(''); // 'tuition' or 'other'
  const [paymentStatus, setPaymentStatus] = useState(''); // 'paid' or 'unpaid'
  const [secondaryLevel, setSecondaryLevel] = useState(''); // 'yes' or 'no'

  const [academicYears, setAcademicYears] = useState<string[]>([]); // Populate with available years
  const [classes, setClasses] = useState<string[]>([]); // Populate with available classes

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [academicYearConfig, setAcademicYearConfig] = useState<AcademicYearConfig | null>(null);
  const [studentPaymentInfo, setStudentPaymentInfo] = useState<StudentPaymentInfo[]>([]);

  const router = useRouter();
    // Fetch available academic years and classes
    // This is a placeholder - you'll need to implement fetching logic
 setAcademicYear('2024-2025'); // Set a default year for testing
    setAcademicYears(['2023-2024', '2024-2025']);
    setClasses(['Terminale S', 'Première L', 'Seconde C']);

    // Fetch all students and all payments for the selected academic year
    const fetchData = async () => {
      if (academicYear) {
        const students = await getAllStudents();
        setAllStudents(students);

        const payments = await getAllPayments(academicYear);
        setAllPayments(payments);

        const config = await getAcademicYearConfig(academicYear);
        setAcademicYearConfig(config);
      }
    };

    fetchData();


  useEffect(() => {
  useEffect(() => {
    // Process payment information when data changes
    if (allStudents.length > 0 && allPayments.length > 0 && academicYearConfig) {
      const processedInfo: StudentPaymentInfo[] = [];

      allStudents.forEach(student => {
        const studentPayments = allPayments.filter(p => p.studentId === student.id);
        let totalAmountPaid = studentPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
        const studentClass = student.class; // Assuming student object has a class property
        const studentLevel = student.level; // Assuming student object has a level property

        let totalFeesDue = 0;
        const tuitionFees = academicYearConfig.tuitionFees[studentClass] || [];
        const otherFees = academicYearConfig.otherFees[studentClass] || [];


        // Calculate total tuition fees due for the student's class
        if (academicYearConfig.tuitionFees && academicYearConfig.tuitionFees[student.class]) {
            totalFeesDue += academicYearConfig.tuitionFees[student.class].reduce((sum, fee) => sum + fee.amount, 0);
        }

         if (academicYearConfig.otherFees[student.class]) {
            totalFeesDue += academicYearConfig.otherFees[student.class].reduce((sum, fee) => sum + fee.amount, 0);
        }


        processedInfo.push({
          studentId: student.id,
          name: `${student.firstName} ${student.lastName}`,
          class: studentClass,
          level: studentLevel, // Add level to StudentPaymentInfo
          totalFeesDue,
          totalAmountPaid,

          balance: totalFeesDue - totalAmountPaid,

          payments: studentPayments,
        });
      });

      setStudentPaymentInfo(processedInfo);
    }
  }, [allStudents, allPayments, academicYearConfig]);
 }, [academicYear, allStudents, allPayments, academicYearConfig]);


  const filteredStudents = studentPaymentInfo.filter(info => {
    let isMatch = true;

    // Filter by Class
    if (selectedClass && info.class !== selectedClass) {
      isMatch = false;
    }

    // Filter by Trimester (only applies to tuition fees)
    if (selectedTrimester) {
      const trimesterFeePaid = info.payments.some(p =>
        p.feeType === 'tuition' &&
        p.feeName === `Trimestre ${selectedTrimester}` &&
        p.amountPaid > 0 // Consider paid if any amount is recorded for the trimester
      );
      const trimesterFeeDue = academicYearConfig?.tuitionFees[info.class]?.some(fee =>
        fee.name === `Trimestre ${selectedTrimester}`
      );

      if (trimesterFeeDue && !trimesterFeePaid) {
         // If filtering for a specific trimester and the student hasn't paid for it
         // This logic might need refinement based on how partial payments are handled
      }
       // For simplicity, let's just filter based on whether *any* payment for that trimester exists
       const hasTrimesterPayment = info.payments.some(p =>
         p.feeType === 'tuition' && p.feeName === `Trimestre ${selectedTrimester}`
       );
       if (!hasTrimesterPayment) isMatch = false;
    }

    // Example for payment status
    // Filter by Payment Status

    // Example for secondary level (assuming student object has a level property)
    // if (secondaryLevel === 'yes' && student.level !== 'secondary') {
    //     isMatch = false;
    // } else if (secondaryLevel === 'no' && student.level === 'secondary') {
    //     isMatch = false;
    // }


    return isMatch;
  });

  const handleExport = () => {
    // Implement export logic here (e.g., to CSV or PDF)
    console.log('Exporting data...');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Statut des Paiements</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select onValueChange={setAcademicYear}>
          <SelectTrigger>
            <SelectValue placeholder="Année Académique" />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedClass}>
          <SelectTrigger>
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les classes</SelectItem>
            {classes.map(className => (
              <SelectItem key={className} value={className}>
                {className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedTrimester}>
          <SelectTrigger>
            <SelectValue placeholder="Trimestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les trimestres</SelectItem>
            <SelectItem value="1">Trimestre 1</SelectItem>
            <SelectItem value="2">Trimestre 2</SelectItem>
            <SelectItem value="3">Trimestre 3</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setFeeType}>
          <SelectTrigger>
            <SelectValue placeholder="Type de Frais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            <SelectItem value="tuition">Frais de Scolarité</SelectItem>
            <SelectItem value="other">Autres Frais</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setPaymentStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Statut de Paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="paid">En ordre</SelectItem>
            <SelectItem value="unpaid">Pas en ordre</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSecondaryLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Niveau Secondaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les niveaux</SelectItem>
            <SelectItem value="yes">Secondaire</SelectItem>
            <SelectItem value="no">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleExport} className="mb-4">Exporter la liste</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de l'élève</TableHead>
            <TableHead>Classe</TableHead>
            <TableHead>Frais Totaux Dus</TableHead>
            <TableHead>Montant Payé</TableHead>
            <TableHead>Solde</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map(student => (
            <TableRow key={student.studentId}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.totalFeesDue.toFixed(2)}</TableCell>
              <TableCell>{student.totalAmountPaid.toFixed(2)}</TableCell>
              <TableCell>{student.balance.toFixed(2)}</TableCell>
              <TableCell>
                <Link href={`/accountant/payments/history/${student.studentId}`}>
                  <Button variant="outline" size="sm">Voir l'historique</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentStatusPage;