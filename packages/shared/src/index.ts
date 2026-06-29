export type EntityId = string;

export interface Student {
  id: EntityId;
  name: string;
  email: string;
  enrolledCourseIds: EntityId[];
}

export interface Teacher {
  id: EntityId;
  name: string;
  email: string;
  specialty: string;
}

export interface Course {
  id: EntityId;
  title: string;
  description: string;
  teacherId: EntityId;
  capacity: number;
}

export type CreateStudentInput = Omit<Student, "id" | "enrolledCourseIds">;
export type CreateTeacherInput = Omit<Teacher, "id">;
export type CreateCourseInput = Omit<Course, "id">;
