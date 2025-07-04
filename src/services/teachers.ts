
import { flattenStructureToCourses, schoolStructure } from '@/lib/school-data';
import type { Teacher } from '@/types';


export type TeacherAssignment = {
    class: string;
    courses: string[];
}

// In a real app, this would likely come from a dedicated 'teachers' collection in Firestore.
const mockTeacherData = [
  {
    id: 'T001',
    name: 'Jean Dupont',
    email: 'jean.dupont@scolagest.cd',
  }
];

export async function getTeacher(name: string): Promise<Partial<Teacher> | null> {
    const teacher = mockTeacherData.find(t => t.name === name);
    return Promise.resolve(teacher || null);
}


export async function getTeacherAssignments(teacherName: string): Promise<TeacherAssignment[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const allCourses = flattenStructureToCourses(schoolStructure);
  const teacherCourses = allCourses.filter(course => course.professeur === teacherName);

  const assignmentsMap: { [className: string]: Set<string> } = {};

  teacherCourses.forEach(course => {
    if (!assignmentsMap[course.className]) {
      assignmentsMap[course.className] = new Set();
    }
    assignmentsMap[course.className].add(course.name);
  });

  const assignments: TeacherAssignment[] = Object.entries(assignmentsMap).map(([className, coursesSet]) => ({
    class: className,
    courses: Array.from(coursesSet),
  }));

  return Promise.resolve(assignments);
}
