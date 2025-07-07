export interface Fee {
  type: 'tuition' | 'other';
  name: string;
  amount: number;
  dueDate?: Date;
}

export interface AcademicYearConfig {
  academicYear: string;
  tuitionFees: { [className: string]: Fee[] };
  otherFees: { [className: string]: Fee[] };
}

export interface Payment {
  id?: string; // Optional ID for database
  studentId: string;
  academicYear: string;
  feeType: 'tuition' | 'other';
  feeName: string;
  amountPaid: number;
  paymentDate: Date;
  receiptNumber?: string;
}