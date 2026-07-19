import type { EntityType } from "../types/ui";

export type Route =
  | { page: "login" }
  | { page: "dashboard" }
  | { page: "courses" }
  | { page: "students" }
  | { page: "teachers" }
  | { page: "detail"; type: EntityType; id: string }
  | { page: "notFound" };

export const entityLabels: Record<EntityType, string> = {
  course: "Curso",
  student: "Estudiante",
  teacher: "Docente",
};

export function parseRoute(pathname: string): Route {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { page: "dashboard" };
  }

  if (segments.length === 1) {
    if (segments[0] === "login") {
      return { page: "login" };
    }

    if (segments[0] === "courses") {
      return { page: "courses" };
    }

    if (segments[0] === "students") {
      return { page: "students" };
    }

    if (segments[0] === "teachers") {
      return { page: "teachers" };
    }
  }

  if (segments.length === 2) {
    if (segments[0] === "courses") {
      return { page: "detail", type: "course", id: segments[1] };
    }

    if (segments[0] === "students") {
      return { page: "detail", type: "student", id: segments[1] };
    }

    if (segments[0] === "teachers") {
      return { page: "detail", type: "teacher", id: segments[1] };
    }
  }

  return { page: "notFound" };
}

export function buildDetailPath(type: EntityType, id: string): string {
  const basePath = {
    course: "courses",
    student: "students",
    teacher: "teachers",
  }[type];

  return `/${basePath}/${id}`;
}

