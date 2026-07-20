import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Course, CourseResource, CourseSection, Quiz, Student, Teacher } from "@courses/shared";
import { buildDetailPath, type Route } from "../routing/routes";
import { api } from "../services/api";
import type {
  CourseActionState,
  CourseContentActionState,
  CourseFormState,
  CourseResourceFormState,
  CourseSectionFormState,
  DetailEntity,
  EntityType,
  LoadState,
  QuizFormState,
  StudentActionState,
} from "../types/ui";

interface UseAcademicDataOptions {
  navigate: (path: string) => void;
  route: Route;
}

export function useAcademicData({ navigate, route }: UseAcademicDataOptions) {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [detailEntity, setDetailEntity] = useState<DetailEntity | null>(null);
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [submitState, setSubmitState] = useState<EntityType | null>(null);
  const [courseActionState, setCourseActionState] =
    useState<CourseActionState>(null);
  const [courseContentActionState, setCourseContentActionState] =
    useState<CourseContentActionState>(null);
  const [studentActionState, setStudentActionState] =
    useState<StudentActionState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [courseTeacherFilter, setCourseTeacherFilter] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [enrollmentStudentId, setEnrollmentStudentId] = useState("");
  const [enrollmentState, setEnrollmentState] = useState(false);
  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
  const [courseResources, setCourseResources] = useState<
    Record<string, CourseResource[]>
  >({});
  const [courseQuizzes, setCourseQuizzes] = useState<
    Record<string, Quiz[]>
  >({});
  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "" });
  const [editStudentForm, setEditStudentForm] = useState({
    name: "",
    email: "",
  });
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    specialty: "",
  });
  const [courseForm, setCourseForm] = useState<CourseFormState>({
    title: "",
    description: "",
    teacherId: "teacher_luis",
    capacity: 25,
    status: "draft",
  });
  const [editCourseForm, setEditCourseForm] = useState<CourseFormState>({
    title: "",
    description: "",
    teacherId: "",
    capacity: 1,
    status: "draft",
  });
  const [courseSectionForm, setCourseSectionForm] =
    useState<CourseSectionFormState>({
      title: "",
      summary: "",
      order: 1,
    });
  const [courseResourceForms, setCourseResourceForms] = useState<
    Record<string, CourseResourceFormState>
  >({});
  const [courseQuizForms, setCourseQuizForms] = useState<
    Record<string, QuizFormState>
  >({});

  function getQuizForm(sectionId: string): QuizFormState {
    return (
      courseQuizForms[sectionId] ?? {
        title: "",
        description: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
          },
        ],
      }
    );
  }

  function setCourseQuizForm(
    sectionId: string,
    updater:
      | QuizFormState
      | ((current: QuizFormState) => QuizFormState),
  ) {
    setCourseQuizForms((current) => {
      const currentForm = getQuizForm(sectionId);
      return {
        ...current,
        [sectionId]:
          typeof updater === "function" ? updater(currentForm) : updater,
      };
    });
  }

  function resetCourseQuizForm(sectionId: string) {
    setCourseQuizForm(sectionId, {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  }

  function getResourceForm(sectionId: string): CourseResourceFormState {
    return (
      courseResourceForms[sectionId] ?? {
        title: "",
        type: "link",
        url: "",
        content: "",
      }
    );
  }

  function setCourseResourceForm(
    sectionId: string,
    updater:
      | CourseResourceFormState
      | ((current: CourseResourceFormState) => CourseResourceFormState),
  ) {
    setCourseResourceForms((current) => {
      const currentForm =
        current[sectionId] ?? {
          title: "",
          type: "link",
          url: "",
          content: "",
        };
      return {
        ...current,
        [sectionId]:
          typeof updater === "function" ? updater(currentForm) : updater,
      };
    });
  }

  function resetCourseResourceForm(sectionId: string) {
    setCourseResourceForm(sectionId, {
      title: "",
      type: "link",
      url: "",
      content: "",
    });
  }

  useEffect(() => {
    setLoadState("loading");
    Promise.all([api.getStudents(), api.getTeachers(), api.getCourses()])
      .then(([studentData, teacherData, courseData]) => {
        setStudents(studentData);
        setTeachers(teacherData);
        setCourses(courseData);
        setCourseForm((current) => ({
          ...current,
          teacherId: current.teacherId || teacherData[0]?.id || "",
        }));
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  useEffect(() => {
    if (route.page !== "detail") {
      setDetailEntity(null);
      setDetailState("idle");
      return;
    }

    setDetailState("loading");
    const detailRequest =
      route.type === "course"
        ? api
            .getCourse(route.id)
            .then((data): DetailEntity => ({ type: "course", data }))
        : route.type === "student"
          ? api
              .getStudent(route.id)
              .then((data): DetailEntity => ({ type: "student", data }))
          : api
              .getTeacher(route.id)
              .then((data): DetailEntity => ({ type: "teacher", data }));

    detailRequest
      .then((entity) => {
        setDetailEntity(entity);
        setDetailState("ready");
      })
      .catch(() => {
        setDetailEntity(null);
        setDetailState("error");
      });
  }, [route]);

  useEffect(() => {
    if (route.page !== "detail" || route.type !== "course") {
      setCourseSections([]);
      setCourseResources({});
      setCourseQuizzes({});
      return;
    }

    api
      .getCourseSections(route.id)
      .then(async (sections) => {
        setCourseSections(sections);
        let resourceEntries: [string, CourseResource[]][] = [];
        try {
          resourceEntries = await Promise.all(
            sections.map(async (section) => [
              section.id,
              await api.getSectionResources(section.id),
            ] as const),
          );
        } catch (error) {
          console.error("Error al cargar recursos de sección:", error);
          resourceEntries = sections.map((section) => [section.id, []] as const);
        }
        setCourseResources(Object.fromEntries(resourceEntries));

        let quizEntries: [string, Quiz[]][] = [];
        try {
          quizEntries = await Promise.all(
            sections.map(async (section) => [
              section.id,
              await api.getSectionQuizzes(section.id),
            ] as const),
          );
        } catch (error) {
          console.warn("No se pudieron cargar los cuestionarios de sección. Puede ser por falta de migración de la tabla 'quizzes':", error);
          quizEntries = sections.map((section) => [section.id, []] as const);
        }
        setCourseQuizzes(Object.fromEntries(quizEntries));

        setCourseSectionForm((current) => ({
          ...current,
          order: sections.length + 1,
        }));
      })
      .catch(() => {
        setCourseSections([]);
        setCourseResources({});
        setCourseQuizzes({});
      });
  }, [route]);

  const teacherById = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers],
  );
  const courseById = useMemo(
    () => new Map(courses.map((course) => [course.id, course])),
    [courses],
  );
  const filteredCourses = useMemo(
    () =>
      courseTeacherFilter
        ? courses.filter((course) => course.teacherId === courseTeacherFilter)
        : courses,
    [courseTeacherFilter, courses],
  );

  const isLoading = loadState === "loading" || loadState === "idle";
  const canCreateCourse = teachers.length > 0 && courseForm.teacherId !== "";

  async function handleCreateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitState("student");

    try {
      const created = await api.createStudent(studentForm);
      setStudents((current) => [...current, created]);
      setStudentForm({ name: "", email: "", password: "" });
      navigate(buildDetailPath("student", created.id));
    } catch (error: any) {
      setFormError(error?.message ?? "No se pudo crear el estudiante. Revisa los datos.");
    } finally {
      setSubmitState(null);
    }
  }

  async function handleCreateTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitState("teacher");

    try {
      const created = await api.createTeacher(teacherForm);
      setTeachers((current) => [...current, created]);
      setTeacherForm({ name: "", email: "", specialty: "" });
      setCourseForm((current) => ({ ...current, teacherId: created.id }));
      navigate(buildDetailPath("teacher", created.id));
    } catch {
      setFormError("No se pudo crear el docente. Revisa los datos.");
    } finally {
      setSubmitState(null);
    }
  }

  function startEditingStudent(student: Student) {
    setFormError(null);
    setEditingStudentId(student.id);
    setEditStudentForm({
      name: student.name,
      email: student.email,
    });
  }

  function cancelEditingStudent() {
    setEditingStudentId(null);
  }

  async function handleUpdateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingStudentId) {
      return;
    }

    setFormError(null);
    setStudentActionState({ type: "update", id: editingStudentId });

    try {
      const updated = await api.updateStudent(editingStudentId, editStudentForm);
      setStudents((current) =>
        current.map((student) =>
          student.id === updated.id ? updated : student,
        ),
      );
      if (
        detailEntity?.type === "student" &&
        detailEntity.data.id === updated.id
      ) {
        setDetailEntity({ type: "student", data: updated });
      }
      setEditingStudentId(null);
    } catch {
      setFormError("No se pudo actualizar el estudiante. Revisa los datos.");
    } finally {
      setStudentActionState(null);
    }
  }

  async function handleDeleteStudent(student: Student) {
    setFormError(null);
    setStudentActionState({ type: "delete", id: student.id });

    try {
      await api.deleteStudent(student.id);
      setStudents((current) =>
        current.filter((currentStudent) => currentStudent.id !== student.id),
      );
      if (editingStudentId === student.id) {
        setEditingStudentId(null);
      }
      if (
        detailEntity?.type === "student" &&
        detailEntity.data.id === student.id
      ) {
        navigate("/students");
      }
    } catch {
      setFormError("No se pudo eliminar el estudiante.");
    } finally {
      setStudentActionState(null);
    }
  }

  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitState("course");
    setCourseActionState({ type: "create" });

    try {
      const created = await api.createCourse(courseForm);
      setCourses((current) => [...current, created]);
      setCourseForm({
        title: "",
        description: "",
        teacherId: teachers[0]?.id ?? "",
        capacity: 25,
        status: "draft",
      });
      navigate(buildDetailPath("course", created.id));
    } catch {
      setFormError("No se pudo crear el curso. Revisa los datos.");
    } finally {
      setSubmitState(null);
      setCourseActionState(null);
    }
  }

  function startEditingCourse(course: Course) {
    setFormError(null);
    setEditingCourseId(course.id);
    setEditCourseForm({
      title: course.title,
      description: course.description,
      teacherId: course.teacherId,
      capacity: course.capacity,
      status: course.status,
    });
  }

  function cancelEditingCourse() {
    setEditingCourseId(null);
  }

  async function handleUpdateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingCourseId) {
      return;
    }

    setFormError(null);
    setCourseActionState({ type: "update", id: editingCourseId });

    try {
      const updated = await api.updateCourse(editingCourseId, editCourseForm);
      setCourses((current) =>
        current.map((course) => (course.id === updated.id ? updated : course)),
      );
      if (
        detailEntity?.type === "course" &&
        detailEntity.data.id === updated.id
      ) {
        setDetailEntity({ type: "course", data: updated });
      }
      setEditingCourseId(null);
    } catch {
      setFormError("No se pudo actualizar el curso. Revisa los datos.");
    } finally {
      setCourseActionState(null);
    }
  }

  async function handleDeleteCourse(course: Course) {
    setFormError(null);
    setCourseActionState({ type: "delete", id: course.id });

    try {
      await api.deleteCourse(course.id);
      setCourses((current) =>
        current.filter((currentCourse) => currentCourse.id !== course.id),
      );
      if (editingCourseId === course.id) {
        setEditingCourseId(null);
      }
      if (
        detailEntity?.type === "course" &&
        detailEntity.data.id === course.id
      ) {
        navigate("/courses");
      }
    } catch {
      setFormError("No se pudo eliminar el curso.");
    } finally {
      setCourseActionState(null);
    }
  }

  async function handleEnrollStudent(course: Course) {
    const availableStudent = students.find(
      (student) => !student.enrolledCourseIds.includes(course.id),
    );
    const studentId = enrollmentStudentId || availableStudent?.id;

    if (!studentId) {
      return;
    }

    setFormError(null);
    setEnrollmentState(true);

    try {
      const updatedStudent = await api.enrollStudentInCourse(
        course.id,
        studentId,
      );
      setStudents((current) =>
        current.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student,
        ),
      );
      if (
        detailEntity?.type === "student" &&
        detailEntity.data.id === updatedStudent.id
      ) {
        setDetailEntity({ type: "student", data: updatedStudent });
      }
      setEnrollmentStudentId("");
    } catch {
      setFormError("No se pudo matricular el estudiante en el curso.");
    } finally {
      setEnrollmentState(false);
    }
  }

  async function handleUnenrollStudent(course: Course, student: Student) {
    setFormError(null);
    setStudentActionState({ type: "unenroll", id: student.id });

    try {
      const updatedStudent = await api.unenrollStudentFromCourse(
        course.id,
        student.id,
      );
      setStudents((current) =>
        current.map((currentStudent) =>
          currentStudent.id === updatedStudent.id
            ? updatedStudent
            : currentStudent,
        ),
      );
      if (
        detailEntity?.type === "student" &&
        detailEntity.data.id === updatedStudent.id
      ) {
        setDetailEntity({ type: "student", data: updatedStudent });
      }
    } catch {
      setFormError("No se pudo retirar la matricula del estudiante.");
    } finally {
      setStudentActionState(null);
    }
  }

  async function handleCreateCourseSection(course: Course) {
    setFormError(null);
    setCourseContentActionState({ type: "create-section" });

    try {
      const created = await api.createCourseSection(course.id, courseSectionForm);
      setCourseSections((current) => [...current, created]);
      setCourseResources((current) => ({ ...current, [created.id]: [] }));
      setCourseQuizzes((current) => ({ ...current, [created.id]: [] }));
      setCourseSectionForm({
        title: "",
        summary: "",
        order: courseSections.length + 2,
      });
    } catch {
      setFormError("No se pudo crear la seccion del curso.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  async function handleDeleteCourseSection(section: CourseSection) {
    setFormError(null);
    setCourseContentActionState({ type: "delete-section", id: section.id });

    try {
      await api.deleteCourseSection(section.id);
      setCourseSections((current) =>
        current.filter((currentSection) => currentSection.id !== section.id),
      );
      setCourseResources((current) => {
        const next = { ...current };
        delete next[section.id];
        return next;
      });
      setCourseQuizzes((current) => {
        const next = { ...current };
        delete next[section.id];
        return next;
      });
    } catch {
      setFormError("No se pudo eliminar la seccion del curso.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  async function handleCreateCourseResource(section: CourseSection) {
    const form = getResourceForm(section.id);
    setFormError(null);
    setCourseContentActionState({ type: "create-resource", id: section.id });

    try {
      const created = await api.createSectionResource(section.id, {
        title: form.title,
        type: form.type,
        url: form.type === "link" ? form.url : undefined,
        content: form.type === "text" ? form.content : undefined,
      });
      setCourseResources((current) => ({
        ...current,
        [section.id]: [...(current[section.id] ?? []), created],
      }));
      resetCourseResourceForm(section.id);
    } catch {
      setFormError("No se pudo crear el recurso de la seccion.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  async function handleDeleteCourseResource(resource: CourseResource) {
    setFormError(null);
    setCourseContentActionState({ type: "delete-resource", id: resource.id });

    try {
      await api.deleteCourseResource(resource.id);
      setCourseResources((current) => ({
        ...current,
        [resource.sectionId]: (current[resource.sectionId] ?? []).filter(
          (currentResource) => currentResource.id !== resource.id,
        ),
      }));
    } catch {
      setFormError("No se pudo eliminar el recurso.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  async function handleCreateCourseQuiz(section: CourseSection) {
    const form = getQuizForm(section.id);
    if (!form.title.trim()) {
      setFormError("El título del cuestionario es obligatorio.");
      return;
    }
    for (const q of form.questions) {
      if (!q.question.trim()) {
        setFormError("Todas las preguntas deben tener un enunciado.");
        return;
      }
      for (let i = 0; i < q.options.length; i++) {
        if (!q.options[i].trim()) {
          setFormError(`Por favor completa todas las opciones de la pregunta: "${q.question}"`);
          return;
        }
      }
    }

    setFormError(null);
    setCourseContentActionState({ type: "create-quiz", id: section.id });

    try {
      const created = await api.createSectionQuiz(section.id, {
        title: form.title,
        description: form.description,
        questions: form.questions,
      });
      setCourseQuizzes((current) => ({
        ...current,
        [section.id]: [...(current[section.id] ?? []), created],
      }));
      resetCourseQuizForm(section.id);
    } catch {
      setFormError("No se pudo crear el cuestionario.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  async function handleDeleteCourseQuiz(quiz: Quiz) {
    setFormError(null);
    setCourseContentActionState({ type: "delete-quiz", id: quiz.id });

    try {
      await api.deleteCourseQuiz(quiz.id);
      setCourseQuizzes((current) => ({
        ...current,
        [quiz.sectionId]: (current[quiz.sectionId] ?? []).filter(
          (currentQuiz) => currentQuiz.id !== quiz.id,
        ),
      }));
    } catch {
      setFormError("No se pudo eliminar el cuestionario.");
    } finally {
      setCourseContentActionState(null);
    }
  }

  return {
    canCreateCourse,
    cancelEditingStudent,
    cancelEditingCourse,
    courseActionState,
    courseContentActionState,
    courseById,
    courseForm,
    courseResourceForms,
    courseResources,
    courseQuizzes,
    courseQuizForms,
    courseSectionForm,
    courseSections,
    courseTeacherFilter,
    courses,
    detailEntity,
    detailState,
    editCourseForm,
    editStudentForm,
    editingCourseId,
    editingStudentId,
    enrollmentState,
    enrollmentStudentId,
    filteredCourses,
    formError,
    handleCreateCourse,
    handleCreateStudent,
    handleCreateTeacher,
    handleDeleteCourse,
    handleDeleteStudent,
    handleCreateCourseResource,
    handleCreateCourseSection,
    handleDeleteCourseResource,
    handleDeleteCourseSection,
    handleCreateCourseQuiz,
    handleDeleteCourseQuiz,
    handleEnrollStudent,
    handleUnenrollStudent,
    handleUpdateCourse,
    handleUpdateStudent,
    isLoading,
    loadState,
    setCourseForm,
    setCourseResourceForm,
    setCourseQuizForm,
    getQuizForm,
    resetCourseQuizForm,
    setCourseSectionForm,
    setCourseTeacherFilter,
    setEditCourseForm,
    setEditStudentForm,
    setEnrollmentStudentId,
    setStudentForm,
    setTeacherForm,
    startEditingCourse,
    startEditingStudent,
    studentForm,
    studentActionState,
    students,
    submitState,
    teacherById,
    teacherForm,
    teachers,
  };
}
