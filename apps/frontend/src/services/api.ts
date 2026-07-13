import type {
  Course,
  CreateCourseInput,
  CreateStudentInput,
  CreateTeacherInput,
  Student,
  Teacher,
  UpdateCourseInput,
} from "@courses/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getStudents: () => request<Student[]>("/students"),
  getStudent: (id: string) => request<Student>(`/students/${id}`),
  createStudent: (input: CreateStudentInput) =>
    request<Student>("/students", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getTeachers: () => request<Teacher[]>("/teachers"),
  getTeacher: (id: string) => request<Teacher>(`/teachers/${id}`),
  createTeacher: (input: CreateTeacherInput) =>
    request<Teacher>("/teachers", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getCourses: (teacherId?: string) =>
    request<Course[]>(
      teacherId ? `/courses?teacherId=${encodeURIComponent(teacherId)}` : "/courses",
    ),
  getCourse: (id: string) => request<Course>(`/courses/${id}`),
  createCourse: (input: CreateCourseInput) =>
    request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateCourse: (id: string, input: UpdateCourseInput) =>
    request<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteCourse: (id: string) =>
    fetch(`${API_URL}/courses/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }),
};
