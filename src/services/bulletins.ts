
import { getStudentByMatricule, getStudentById } from './students';
import { getGradesForStudent } from './grades';
import { getAcademicTerms } from './academic';
import type { Student, Grade, AcademicTerm } from '@/types';

export interface BulletinData {
  student: Student;
  term: AcademicTerm;
  gradesByCourse: Record<string, Grade[]>;
  courseAverages: Record<string, string>;
  overallAverage: string;
}

const calculateAverage = (grades: Grade[]): string => {
    let total = 0;
    let count = 0;
    grades.forEach(g => {
        const match = g.grade.match(/(\d+(\.\d+)?)\s*\/\s*(\d+)/);
        if (match) {
            const score = parseFloat(match[1]);
            const max = parseInt(match[3], 10);
            if (!isNaN(score) && !isNaN(max) && max > 0) {
                total += (score / max) * 20; // Normalize to 20
                count++;
            }
        }
    });
    if (count === 0) return '--/20';
    return `${(total / count).toFixed(2)}/20`;
};

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);


export async function getBulletinDataForStudent(studentId: string, termId: string): Promise<BulletinData | null> {
    try {
        const [student, allTerms, allGrades] = await Promise.all([
            getStudentById(studentId),
            getAcademicTerms(),
            getGradesForStudent(studentId, true) // Pass true to get all grades for the student
        ]);

        if (!student) throw new Error("Student not found");
        
        const term = allTerms.find(t => t.id === termId);
        if (!term) throw new Error("Academic term not found");

        const termGrades = allGrades.filter(g => g.semester === term.semester && g.period === term.period);

        const gradesByCourse = groupBy(termGrades, grade => grade.course);
        
        const courseAverages: Record<string, string> = {};
        for (const course in gradesByCourse) {
            courseAverages[course] = calculateAverage(gradesByCourse[course]);
        }
        
        const overallAverage = calculateAverage(termGrades);

        return {
            student,
            term,
            gradesByCourse,
            courseAverages,
            overallAverage,
        };

    } catch (error) {
        console.error("Error fetching bulletin data:", error);
        return null;
    }
}
