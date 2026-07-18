import type {
  Course,
  CourseResource,
  CourseSection,
  CreateCourseInput,
  CreateCourseResourceInput,
  CreateCourseSectionInput,
  CreateStudentInput,
  CreateTeacherInput,
  Student,
  Teacher,
  UpdateCourseInput,
  UpdateStudentInput,
  Quiz,
  CreateQuizInput,
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
  updateStudent: (id: string, input: UpdateStudentInput) =>
    request<Student>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteStudent: (id: string) =>
    fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
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
  getCourseSections: (courseId: string) =>
    request<CourseSection[]>(`/courses/${courseId}/sections`),
  createCourseSection: (
    courseId: string,
    input: Omit<CreateCourseSectionInput, "courseId">,
  ) =>
    request<CourseSection>(`/courses/${courseId}/sections`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteCourseSection: (sectionId: string) =>
    fetch(`${API_URL}/courses/sections/${sectionId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }),
  getSectionResources: (sectionId: string) =>
    request<CourseResource[]>(`/courses/sections/${sectionId}/resources`),
  createSectionResource: (
    sectionId: string,
    input: Omit<CreateCourseResourceInput, "sectionId">,
  ) =>
    request<CourseResource>(`/courses/sections/${sectionId}/resources`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteCourseResource: (resourceId: string) =>
    fetch(`${API_URL}/courses/resources/${resourceId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }),
  getCourseStudents: (courseId: string) =>
    request<Student[]>(`/courses/${courseId}/students`),
  enrollStudentInCourse: (courseId: string, studentId: string) =>
    request<Student>(`/courses/${courseId}/students/${studentId}`, {
      method: "POST",
    }),
  unenrollStudentFromCourse: (courseId: string, studentId: string) =>
    request<Student>(`/courses/${courseId}/students/${studentId}`, {
      method: "DELETE",
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
  getSectionQuizzes: (sectionId: string) =>
    request<Quiz[]>(`/courses/sections/${sectionId}/quizzes`),
  createSectionQuiz: (
    sectionId: string,
    input: Omit<CreateQuizInput, "sectionId">,
  ) =>
    request<Quiz>(`/courses/sections/${sectionId}/quizzes`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  deleteCourseQuiz: (quizId: string) =>
    fetch(`${API_URL}/courses/quizzes/${quizId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }),
};
