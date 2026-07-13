import type { Course, Student, Teacher } from "@courses/shared";

export type LoadState = "idle" | "loading" | "ready" | "error";
export type EntityType = "course" | "student" | "teacher";

export type CourseFormState = {
  title: string;
  description: string;
  teacherId: string;
  capacity: number;
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

export type DetailEntity =
  | { type: "course"; data: Course }
  | { type: "student"; data: Student }
  | { type: "teacher"; data: Teacher };
