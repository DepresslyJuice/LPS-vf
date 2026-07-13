import type { Course, Student, Teacher } from "@courses/shared";

export type LoadState = "idle" | "loading" | "ready" | "error";
export type EntityType = "course" | "student" | "teacher";

export type CourseFormState = {
  title: string;
  description: string;
  teacherId: string;
  capacity: number;
  status: Course["status"];
};

export type CourseSectionFormState = {
  title: string;
  summary: string;
  order: number;
};

export type CourseResourceFormState = {
  title: string;
  type: "link" | "text";
  url: string;
  content: string;
};

export type CourseActionState =
  | { type: "create" }
  | { type: "update"; id: string }
  | { type: "delete"; id: string }
  | null;

export type StudentActionState =
  | { type: "update"; id: string }
  | { type: "delete"; id: string }
  | { type: "unenroll"; id: string }
  | null;

export type CourseContentActionState =
  | { type: "create-section" }
  | { type: "delete-section"; id: string }
  | { type: "create-resource"; id: string }
  | { type: "delete-resource"; id: string }
  | null;

export type DetailEntity =
  | { type: "course"; data: Course }
  | { type: "student"; data: Student }
  | { type: "teacher"; data: Teacher };
