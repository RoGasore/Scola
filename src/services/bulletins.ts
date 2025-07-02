

import { getStudentById } from './students';
import { getGradesForStudent } from './grades';
import { getAcademicTerms, getAcademicTermsForYear } from './academic';
import { getCoursesForClass } from '@/lib/school-data';
import { schoolStructure } from '@/lib/school-data';
import type { Student, Grade, AcademicTerm, Course, BulletinData, BulletinDomain, BulletinSubDomain, BulletinCourse } from '@/types';

const parseGrade = (grade: string): number => {
    if (!grade) return 0;
    const match = grade.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

// Main function to generate bulletin data
export async function getBulletinDataForStudent(studentId: string, termId: string): Promise<BulletinData | null> {
    try {
        const [student, allGrades, allTerms] = await Promise.all([
            getStudentById(studentId),
            getGradesForStudent(studentId, true),
            getAcademicTerms(),
        ]);

        if (!student) throw new Error("Student not found");
        if (student.level !== 'Secondaire') {
            console.warn(`Bulletin generation for level '${student.level}' is not yet implemented.`);
            return null; // For now, only handle Secondary level
        }

        const term = allTerms.find(t => t.id === termId);
        if (!term) throw new Error("Term not found");
        
        const year = new Date(term.startDate).getFullYear();
        const yearTerms = getAcademicTermsForYear(allTerms, year);
        
        const allStudentCourses = getCoursesForClass(student.classe);
        const courseDetails: Course[] = [];
        
        const findCourseInStructure = (className: string) => {
            let courses: any[] = [];
            // @ts-ignore
            if (schoolStructure.Maternelle.classes[className]) courses = schoolStructure.Maternelle.classes[className].courses;
            // @ts-ignore
            else if (schoolStructure.Primaire.classes[className]) courses = schoolStructure.Primaire.classes[className].courses;
            // @ts-ignore
            else if (schoolStructure.Secondaire['Éducation de base'].classes[className]) courses = schoolStructure.Secondaire['Éducation de base'].classes[className].courses;
            else {
                for (const option of Object.values(schoolStructure.Secondaire.Humanités.options)) { // @ts-ignore
                    if (option.classes[className]) { courses = option.classes[className].courses; break; }
                }
            }
            return courses;
        };
        
        const structureCourses = findCourseInStructure(student.classe);
        allStudentCourses.forEach(courseName => {
            const detail = structureCourses.find(c => c.name === courseName);
            if (detail) courseDetails.push(detail);
        });

        const bulletinCourses: BulletinCourse[] = courseDetails.map(course => {
            const courseGrades = allGrades.filter(g => g.course === course.name);
            const getGradeForPeriod = (semester: number, period: number) => {
                 return courseGrades.find(g => g.semester === semester && g.period === period) || null;
            }
            const getGradeForExam = (semester: number) => {
                 return courseGrades.find(g => g.semester === semester && g.type.toLowerCase().includes('examen')) || null;
            }

            const s1p1 = parseGrade(getGradeForPeriod(1, 1)?.grade || '');
            const s1p2 = parseGrade(getGradeForPeriod(1, 2)?.grade || '');
            const s1exam = parseGrade(getGradeForExam(1)?.grade || '');
            const s2p1 = parseGrade(getGradeForPeriod(2, 3)?.grade || '');
            const s2p2 = parseGrade(getGradeForPeriod(2, 4)?.grade || '');
            const s2exam = parseGrade(getGradeForExam(2)?.grade || '');
            
            const totalS1 = s1p1 + s1p2 + s1exam;
            const totalS2 = s2p1 + s2p2 + s2exam;
            
            return {
                ...course,
                grades: {
                    s1: { p1: getGradeForPeriod(1, 1), p2: getGradeForPeriod(1, 2), exam: getGradeForExam(1) },
                    s2: { p1: getGradeForPeriod(2, 3), p2: getGradeForPeriod(2, 4), exam: getGradeForExam(2) },
                },
                totals: { s1: totalS1, s2: totalS2, tg: totalS1 + totalS2 }
            }
        });

        // Group by Domain and SubDomain
        const domainsMap: { [domainName: string]: BulletinDomain } = {};
        
        bulletinCourses.forEach(bc => {
            const domainName = bc.domain;
            const subDomainName = bc.subDomain || 'default';

            if (!domainsMap[domainName]) {
                domainsMap[domainName] = { name: domainName, subDomains: [], totals: { maxima: {s1:0,s2:0,tg:0}, student: {s1:0,s2:0,tg:0} } };
            }

            let subDomain = domainsMap[domainName].subDomains.find(sd => sd.name === subDomainName);
            if (!subDomain) {
                subDomain = { name: subDomainName, courses: [], totals: { maxima: {s1:0,s2:0,tg:0}, student: {s1:0,s2:0,tg:0} } };
                domainsMap[domainName].subDomains.push(subDomain);
            }
            subDomain.courses.push(bc);
        });

        // Calculate totals
        let grandTotals = { maxima: { s1: 0, s2: 0, tg: 0 }, student: { s1: 0, s2: 0, tg: 0 } };

        Object.values(domainsMap).forEach(domain => {
            domain.subDomains.forEach(subDomain => {
                subDomain.courses.forEach(course => {
                    const maxS1 = course.maxima.p1 * 2 + course.maxima.exam;
                    const maxS2 = course.maxima.p1 * 2 + course.maxima.exam; // Assuming same maxima for S2
                    subDomain.totals.maxima.s1 += maxS1;
                    subDomain.totals.maxima.s2 += maxS2;
                    subDomain.totals.student.s1 += course.totals.s1;
                    subDomain.totals.student.s2 += course.totals.s2;
                });
                subDomain.totals.maxima.tg = subDomain.totals.maxima.s1 + subDomain.totals.maxima.s2;
                subDomain.totals.student.tg = subDomain.totals.student.s1 + subDomain.totals.student.s2;
                domain.totals.maxima.s1 += subDomain.totals.maxima.s1;
                domain.totals.maxima.s2 += subDomain.totals.maxima.s2;
                domain.totals.student.s1 += subDomain.totals.student.s1;
                domain.totals.student.s2 += subDomain.totals.student.s2;
            });
            domain.totals.maxima.tg = domain.totals.maxima.s1 + domain.totals.maxima.s2;
            domain.totals.student.tg = domain.totals.student.s1 + domain.totals.student.s2;
            grandTotals.maxima.s1 += domain.totals.maxima.s1;
            grandTotals.maxima.s2 += domain.totals.maxima.s2;
            grandTotals.student.s1 += domain.totals.student.s1;
            grandTotals.student.s2 += domain.totals.student.s2;
        });

        grandTotals.maxima.tg = grandTotals.maxima.s1 + grandTotals.maxima.s2;
        grandTotals.student.tg = grandTotals.student.s1 + grandTotals.student.s2;
        
        const percentage = grandTotals.maxima.tg > 0 ? ((grandTotals.student.tg / grandTotals.maxima.tg) * 100).toFixed(2) + '%' : 'N/A';
        
        return {
            student,
            term,
            domains: Object.values(domainsMap),
            grandTotals,
            percentage,
        };

    } catch (error) {
        console.error("Error fetching bulletin data:", error);
        return null;
    }
}
