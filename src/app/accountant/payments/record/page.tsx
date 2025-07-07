'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Payment, AcademicYearConfig } from '@/types/accounting';
import { savePayment, getAcademicYearConfig } from '@/services/accounting';
import { getStudents } from '@/services/students'; // Assuming a service to get student data
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/types/index'; // Assuming a type for student data

const PaymentRecordingPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<string[]>([]); // You might want to fetch this dynamically
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [feeTypes, setFeeTypes] = useState<string[]>(['tuition', 'other']); // Or fetch from config
  const [selectedFeeType, setSelectedFeeType] = useState<string>('');
  const [fees, setFees] = useState<any[]>([]); // To hold fee options based on type and year
  const [selectedFeeName, setSelectedFeeName] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [academicYearConfig, setAcademicYearConfig] = useState<AcademicYearConfig | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch students
    const fetchStudents = async () => {
      const studentsData = await getStudents(); // Implement this service
      setStudents(studentsData);
    };
    fetchStudents();

    // Fetch available academic years (for now, hardcode or fetch from configs)
    setAcademicYears(['2023-2024', '2024-2025']);
  }, []);

  useEffect(() => {
    // Fetch academic year config when year is selected
    if (selectedAcademicYear) {
      const fetchConfig = async () => {
        const config = await getAcademicYearConfig(selectedAcademicYear);
        setAcademicYearConfig(config);
      };
      fetchConfig();
    }
  }, [selectedAcademicYear]);

  useEffect(() => {
    // Update fee options based on selected year and type
    if (academicYearConfig && selectedFeeType) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student && student.class) {
        const studentClass = student.class;
        if (selectedFeeType === 'tuition' && academicYearConfig.tuitionFeesByClass[studentClass]) {
 setFees(academicYearConfig.tuitionFeesByClass[studentClass] || []);
        } else if (selectedFeeType === 'other' && academicYearConfig.otherFeesByClass[studentClass]) {
            setFees(academicYearConfig.otherFeesByClass[studentClass]);
        } else {
            setFees([]);
        }
      } else {
        setFees([]);
      }
    } else {
      setFees([]);
    }
  }, [selectedAcademicYear, selectedFeeType, academicYearConfig, selectedStudentId, students]);


  const handleSavePayment = async (event: React.FormEvent) => {
    if (!selectedStudentId || !selectedAcademicYear || !selectedFeeType || !selectedFeeName || amountPaid <= 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newPayment: Payment = {
      studentId: selectedStudentId,
      academicYear: selectedAcademicYear,
      feeType: selectedFeeType,
      feeName: selectedFeeName,
      amountPaid: amountPaid,
      paymentDate: new Date(),
      // receiptNumber will be generated on save
    };

    try {
      await savePayment(newPayment);
      toast({
        title: 'Payment Saved',
        description: 'The payment has been recorded successfully.',
      });
      // Optionally, reset the form or navigate to receipt generation
      // Keep selected year and student for potentially adding another payment for the same student
      // setSelectedStudentId('');
      // setSelectedAcademicYear('');
      setSelectedFeeType(''); // Clear fee details after saving
      setSelectedFeeName('');
      setFees([]); // Clear fee options

      setAmountPaid(0);
    } catch (error) {
      console.error('Error saving payment:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the payment.',
        variant: 'destructive',
      });
    }
  };


  const handleGenerateReceipt = () => {
    // Logic to generate and display/print receipt
    toast({
      title: 'Receipt Generation',
      description: 'Receipt generation feature is not yet implemented.',
    });
  };

  return (
    <div className="container mx-auto py-8">
 <h1 className="text-2xl font-bold mb-6">Enregistrer un Paiement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="student">Élève</Label>
          <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
            <SelectTrigger id="student">
              <SelectValue placeholder="Sélectionner un élève" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} {/* Adjust to student's name property */}
                </SelectItem>  
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="academic-year">Année Académique</Label>
          <Select onValueChange={setSelectedAcademicYear} value={selectedAcademicYear}>
            <SelectTrigger id="academic-year">
              <SelectValue placeholder="Sélectionner l'année" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fee-type">Type de Frais</Label>
          <Select onValueChange={setSelectedFeeType} value={selectedFeeType}>
            <SelectTrigger id="fee-type">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {feeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'tuition' ? 'Frais Scolaire' : 'Autres Frais'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fee-name">Nom du Frais</Label>
           <Select onValueChange={setSelectedFeeName} value={selectedFeeName} disabled={fees.length === 0}>
            <SelectTrigger id="fee-name">
              <SelectValue placeholder="Sélectionner le frais" />
            </SelectTrigger>
            <SelectContent>
              {fees.map((fee) => (
                <SelectItem key={fee.name} value={fee.name}>
                  {fee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount-paid">Montant Payé</Label>
          <Input
            id="amount-paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <Button onClick={handleSavePayment}>Enregistrer Paiement</Button>
        <Button onClick={handleGenerateReceipt} disabled>Générer Reçu (En développement)</Button>
      </div>
    </div>
  );
};

export default PaymentRecordingPage;