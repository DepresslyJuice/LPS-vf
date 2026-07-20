export type EntityId = string;
export type CourseStatus = "draft" | "published" | "archived";
export type CourseResourceType = "link" | "text";

export interface Student {
  id: EntityId;
  name: string;
  email: string;
  enrolledCourseIds: EntityId[];
  usuarioId?: number;
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
  status: CourseStatus;
}

export interface CourseSection {
  id: EntityId;
  courseId: EntityId;
  title: string;
  summary: string;
  order: number;
}

export interface CourseResource {
  id: EntityId;
  sectionId: EntityId;
  title: string;
  type: CourseResourceType;
  url?: string;
  content?: string;
}

export type CreateStudentInput = Omit<Student, "id" | "enrolledCourseIds">;
export type CreateStudentWithPasswordInput = CreateStudentInput & { password: string };
export type UpdateStudentInput = Partial<CreateStudentInput>;
export type CreateTeacherInput = Omit<Teacher, "id">;
export type CreateCourseInput = Omit<Course, "id">;
export type UpdateCourseInput = Partial<CreateCourseInput>;
export type CreateCourseSectionInput = Omit<CourseSection, "id">;
export type UpdateCourseSectionInput = Partial<
  Omit<CourseSection, "id" | "courseId">
>;
export type CreateCourseResourceInput = Omit<CourseResource, "id">;
export type UpdateCourseResourceInput = Partial<
  Omit<CourseResource, "id" | "sectionId">
>;

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: EntityId;
  sectionId: EntityId;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export type CreateQuizInput = Omit<Quiz, "id">;
export type UpdateQuizInput = Partial<
  Omit<Quiz, "id" | "sectionId">
>;

