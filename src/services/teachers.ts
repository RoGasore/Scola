

import { flattenStructureToCourses, schoolStructure } from '@/lib/school-data';

// This service simulates fetching a teacher's assignments from the school structure.
// In a real app, this would likely come from a dedicated 'teachers' collection in Firestore.

type Assignment = {
    class: string;
    courses: string[];
}

export async function getTeacherAssignments(teacherName: string): Promise<Assignment[]> {
  console.log(`Fetching assignments for teacher ${teacherName}...`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const allCourses = flattenStructureToCourses(schoolStructure);
  const teacherCourses = allCourses.filter(course => course.professeur === teacherName);

  const assignmentsMap: { [className: string]: Set<string> } = {};

  teacherCourses.forEach(course => {
    if (!assignmentsMap[course.className]) {
      assignmentsMap[course.className] = new Set();
    }
    assignmentsMap[course.className].add(course.name);
  });

  const assignments: Assignment[] = Object.entries(assignmentsMap).map(([className, coursesSet]) => ({
    class: className,
    courses: Array.from(coursesSet),
  }));

  return Promise.resolve(assignments);
}
