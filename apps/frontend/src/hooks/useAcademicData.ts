import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Course, Student, Teacher } from "@courses/shared";
import { buildDetailPath, type Route } from "../routing/routes";
import { api } from "../services/api";
import type {
  CourseActionState,
  CourseFormState,
  DetailEntity,
  EntityType,
  LoadState,
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
  const [studentActionState, setStudentActionState] =
    useState<StudentActionState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [courseTeacherFilter, setCourseTeacherFilter] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [enrollmentStudentId, setEnrollmentStudentId] = useState("");
  const [enrollmentState, setEnrollmentState] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: "", email: "" });
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
  });
  const [editCourseForm, setEditCourseForm] = useState<CourseFormState>({
    title: "",
    description: "",
    teacherId: "",
    capacity: 1,
  });

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
      setStudentForm({ name: "", email: "" });
      navigate(buildDetailPath("student", created.id));
    } catch {
      setFormError("No se pudo crear el estudiante. Revisa los datos.");
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

  return {
    canCreateCourse,
    cancelEditingStudent,
    cancelEditingCourse,
    courseActionState,
    courseById,
    courseForm,
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
    handleEnrollStudent,
    handleUnenrollStudent,
    handleUpdateCourse,
    handleUpdateStudent,
    isLoading,
    loadState,
    setCourseForm,
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
