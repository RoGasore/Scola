import type { Course, Student } from '@/types';
import { getStudentByMatricule } from './students';
import { schoolStructure } from '@/lib/school-data';

// This service simulates fetching a student's courses based on their class.
export async function getCoursesForStudent(matricule: string): Promise<Course[]> {
  const student = await getStudentByMatricule(matricule);
  if (!student) {
    throw new Error("Student not found");
  }

  const { level, classe, section, option } = student;
  const studentCourses: Course[] = [];

  const findCourses = (classInfo: any) => {
    if (classInfo && classInfo.isActive && classInfo.name === classe) {
      classInfo.courses.forEach((course: any) => {
        studentCourses.push({
          name: course.name,
          professeur: course.professeur || 'Non assigné',
          className: classInfo.name,
          level: level,
          description: `Cours de ${course.name} pour la ${classInfo.name}.`,
          room: course.room || 'N/A',
        });
      });
      return true; // Found
    }
    return false; // Not found
  };

  if (level === 'Maternelle') {
    Object.values(schoolStructure.Maternelle.classes).find(findCourses);
  } else if (level === 'Primaire') {
    Object.values(schoolStructure.Primaire.classes).find(findCourses);
  } else if (level === 'Secondaire' && section) {
    if (section === 'Éducation de base') {
      Object.values(schoolStructure.Secondaire['Éducation de base'].classes).find(findCourses);
    } else if (section === 'Humanités' && option) {
      const optionData = (schoolStructure.Secondaire.Humanités.options as any)[option];
      if (optionData) {
        Object.values(optionData.classes).find(findCourses);
      }
    }
  }

  return Promise.resolve(studentCourses);
}
