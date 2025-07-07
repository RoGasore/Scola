import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import { AcademicYearConfig, Fee, Payment } from "@/types/accounting";

const academicYearsCollection = collection(db, "academicYears");
const paymentsCollection = collection(db, "payments");

export const saveAcademicYearConfig = async (config: AcademicYearConfig) => {
  try {
    const docRef = doc(academicYearsCollection, config.academicYear);
    await setDoc(docRef, config);
    console.log("Academic year configuration saved successfully!");
  } catch (e) {
    console.error("Error saving academic year configuration: ", e);
    throw e;
  }
};

export const getAcademicYearConfig = async (year: string): Promise<AcademicYearConfig | null> => {
  try {
    const docRef = doc(academicYearsCollection, year);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AcademicYearConfig;
    } else {
      console.log("No such academic year configuration!");
      return null;
    }
  } catch (e) {
    console.error("Error getting academic year configuration: ", e);
    throw e;
  }
};

export const savePayment = async (payment: Payment) => {
  try {
    await addDoc(paymentsCollection, payment);
    console.log("Payment saved successfully!");
  } catch (e) {
    console.error("Error saving payment: ", e);
    throw e;
  }
};

export const getPaymentsByStudent = async (studentId: string, academicYear: string): Promise<Payment[]> => {
  try {
    const q = query(
      paymentsCollection,
      where("studentId", "==", studentId),
      where("academicYear", "==", academicYear)
    );
    const querySnapshot = await getDocs(q);
    const payments: Payment[] = [];
    querySnapshot.forEach((doc) => {
      payments.push(doc.data() as Payment);
    });
    return payments;
  } catch (e) {
    console.error("Error getting payments by student: ", e);
    throw e;
  }
};

export const getAllPayments = async (academicYear: string): Promise<Payment[]> => {
  try {
    const q = query(paymentsCollection, where("academicYear", "==", academicYear));
    const querySnapshot = await getDocs(q);
    const payments: Payment[] = [];
    querySnapshot.forEach((doc) => {
      payments.push(doc.data() as Payment);
    });
    return payments;
  } catch (e) {
    console.error("Error getting all payments: ", e);
    throw e;
  }
};