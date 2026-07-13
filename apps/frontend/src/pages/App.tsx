import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import type { Course, Student, Teacher } from "@courses/shared";
import { Metric } from "../components/Metric";
import { Section } from "../components/Section";
import { api } from "../services/api";

type LoadState = "idle" | "loading" | "ready" | "error";
type EntityType = "course" | "student" | "teacher";
type CourseFormState = {
  title: string;
  description: string;
  teacherId: string;
  capacity: number;
};
type CourseActionState =
  | { type: "create" }
  | { type: "update"; id: string }
  | { type: "delete"; id: string }
  | null;
type DetailEntity =
  | { type: "course"; data: Course }
  | { type: "student"; data: Student }
  | { type: "teacher"; data: Teacher };
type Route =
  | { page: "dashboard" }
  | { page: "courses" }
  | { page: "students" }
  | { page: "teachers" }
  | { page: "detail"; type: EntityType; id: string }
  | { page: "notFound" };

const entityLabels: Record<EntityType, string> = {
  course: "Curso",
  student: "Estudiante",
  teacher: "Docente",
};

function parseRoute(pathname: string): Route {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { page: "dashboard" };
  }

  if (segments.length === 1) {
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

function buildDetailPath(type: EntityType, id: string): string {
  const basePath = {
    course: "courses",
    student: "students",
    teacher: "teachers",
  }[type];

  return `/${basePath}/${id}`;
}

export function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.pathname),
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [detailEntity, setDetailEntity] = useState<DetailEntity | null>(null);
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [submitState, setSubmitState] = useState<EntityType | null>(null);
  const [courseActionState, setCourseActionState] =
    useState<CourseActionState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [courseTeacherFilter, setCourseTeacherFilter] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [enrollmentStudentId, setEnrollmentStudentId] = useState("");
  const [enrollmentState, setEnrollmentState] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: "", email: "" });
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
    function syncRoute() {
      setRoute(parseRoute(window.location.pathname));
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

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

  const isLoading = loadState === "loading" || loadState === "idle";
  const canCreateCourse = teachers.length > 0 && courseForm.teacherId !== "";
  const filteredCourses = useMemo(
    () =>
      courseTeacherFilter
        ? courses.filter((course) => course.teacherId === courseTeacherFilter)
        : courses,
    [courseTeacherFilter, courses],
  );

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isActive(path: string): boolean {
    return window.location.pathname === path;
  }

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

  function renderDetail() {
    if (detailState === "loading") {
      return <div className="emptyDetail">Cargando detalle...</div>;
    }

    if (detailState === "error" || !detailEntity) {
      return (
        <div className="notice compactNotice">
          No se pudo cargar el detalle seleccionado.
        </div>
      );
    }

    if (detailEntity.type === "course") {
      const course = detailEntity.data;
      const teacher = teacherById.get(course.teacherId);
      const enrolledStudents = students.filter((student) =>
        student.enrolledCourseIds.includes(course.id),
      );
      const availableStudents = students.filter(
        (student) => !student.enrolledCourseIds.includes(course.id),
      );
      const selectedEnrollmentStudentId =
        enrollmentStudentId || availableStudents[0]?.id || "";
      const hasAvailableSeats = enrolledStudents.length < course.capacity;

      return (
        <article className="detailPanel">
          <div className="detailTitle">
            <span>{entityLabels.course}</span>
            <h3>{course.title}</h3>
          </div>
          <p>{course.description}</p>
          <dl className="detailList">
            <div>
              <dt>ID</dt>
              <dd>{course.id}</dd>
            </div>
            <div>
              <dt>Docente</dt>
              <dd>{teacher?.name ?? course.teacherId}</dd>
            </div>
            <div>
              <dt>Cupos</dt>
              <dd>
                {enrolledStudents.length} / {course.capacity}
              </dd>
            </div>
          </dl>
          <div className="enrollmentPanel">
            <h4>Matricula</h4>
            <div className="formRow">
              <select
                disabled={availableStudents.length === 0 || !hasAvailableSeats}
                onChange={(event) => setEnrollmentStudentId(event.target.value)}
                value={selectedEnrollmentStudentId}
              >
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <button
                disabled={
                  enrollmentState ||
                  availableStudents.length === 0 ||
                  !hasAvailableSeats
                }
                onClick={() => handleEnrollStudent(course)}
                type="button"
              >
                {enrollmentState ? "Matriculando..." : "Matricular"}
              </button>
            </div>
            {!hasAvailableSeats ? (
              <p className="helperText">El curso no tiene cupos disponibles.</p>
            ) : null}
            {availableStudents.length === 0 && hasAvailableSeats ? (
              <p className="helperText">
                No hay estudiantes disponibles para matricular.
              </p>
            ) : null}
            <div className="tableLike">
              {enrolledStudents.length === 0 ? (
                <div className="emptyDetail">Sin estudiantes matriculados.</div>
              ) : null}
              {enrolledStudents.map((student) => (
                <div className="row" key={student.id}>
                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.email}</span>
                  </div>
                  <button
                    className="inlineButton"
                    onClick={() =>
                      navigate(buildDetailPath("student", student.id))
                    }
                    type="button"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
          </div>
        </article>
      );
    }

    if (detailEntity.type === "student") {
      const student = detailEntity.data;
      const enrolledCourses = student.enrolledCourseIds
        .map((courseId) => courseById.get(courseId))
        .filter((course): course is Course => Boolean(course));

      return (
        <article className="detailPanel">
          <div className="detailTitle">
            <span>{entityLabels.student}</span>
            <h3>{student.name}</h3>
          </div>
          <dl className="detailList">
            <div>
              <dt>ID</dt>
              <dd>{student.id}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>Cursos inscritos</dt>
              <dd>
                {enrolledCourses.length > 0
                  ? enrolledCourses.map((course) => course.title).join(", ")
                  : "Sin cursos inscritos"}
              </dd>
            </div>
          </dl>
        </article>
      );
    }

    const teacher = detailEntity.data;
    const assignedCourses = courses.filter(
      (course) => course.teacherId === teacher.id,
    );

    return (
      <article className="detailPanel">
        <div className="detailTitle">
          <span>{entityLabels.teacher}</span>
          <h3>{teacher.name}</h3>
        </div>
        <dl className="detailList">
          <div>
            <dt>ID</dt>
            <dd>{teacher.id}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{teacher.email}</dd>
          </div>
          <div>
            <dt>Especialidad</dt>
            <dd>{teacher.specialty}</dd>
          </div>
          <div>
            <dt>Cursos asignados</dt>
            <dd>
              {assignedCourses.length > 0
                ? assignedCourses.map((course) => course.title).join(", ")
                : "Sin cursos asignados"}
            </dd>
          </div>
        </dl>
      </article>
    );
  }

  return (
    <main className="appShell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fabrica de software academica</p>
          <h1>Courses Platform</h1>
        </div>
        <span className={`status status-${loadState}`}>{loadState}</span>
      </header>

      <nav className="pageNav" aria-label="Paginas principales">
        <button
          className={`tabButton ${isActive("/") ? "isActive" : ""}`}
          onClick={() => navigate("/")}
          type="button"
        >
          Inicio
        </button>
        <button
          className={`tabButton ${isActive("/courses") ? "isActive" : ""}`}
          onClick={() => navigate("/courses")}
          type="button"
        >
          Cursos
        </button>
        <button
          className={`tabButton ${isActive("/students") ? "isActive" : ""}`}
          onClick={() => navigate("/students")}
          type="button"
        >
          Estudiantes
        </button>
        <button
          className={`tabButton ${isActive("/teachers") ? "isActive" : ""}`}
          onClick={() => navigate("/teachers")}
          type="button"
        >
          Docentes
        </button>
      </nav>

      {loadState === "error" ? (
        <div className="notice">
          No se pudo conectar con la API. Inicia el backend en
          http://localhost:3000/api.
        </div>
      ) : null}

      {formError ? <div className="notice">{formError}</div> : null}

      {route.page === "dashboard" ? (
        <DashboardPage
          courses={courses}
          navigate={navigate}
          students={students}
          teachers={teachers}
        />
      ) : null}

      {route.page === "courses" ? (
        <CoursesPage
          canCreateCourse={canCreateCourse}
          cancelEditingCourse={cancelEditingCourse}
          courseActionState={courseActionState}
          courseForm={courseForm}
          courseTeacherFilter={courseTeacherFilter}
          courses={filteredCourses}
          editCourseForm={editCourseForm}
          editingCourseId={editingCourseId}
          handleCreateCourse={handleCreateCourse}
          handleDeleteCourse={handleDeleteCourse}
          handleUpdateCourse={handleUpdateCourse}
          isLoading={isLoading}
          navigate={navigate}
          setCourseForm={setCourseForm}
          setCourseTeacherFilter={setCourseTeacherFilter}
          setEditCourseForm={setEditCourseForm}
          startEditingCourse={startEditingCourse}
          submitState={submitState}
          teacherById={teacherById}
          teachers={teachers}
        />
      ) : null}

      {route.page === "students" ? (
        <StudentsPage
          handleCreateStudent={handleCreateStudent}
          isLoading={isLoading}
          navigate={navigate}
          setStudentForm={setStudentForm}
          studentForm={studentForm}
          students={students}
          submitState={submitState}
        />
      ) : null}

      {route.page === "teachers" ? (
        <TeachersPage
          handleCreateTeacher={handleCreateTeacher}
          isLoading={isLoading}
          navigate={navigate}
          setTeacherForm={setTeacherForm}
          submitState={submitState}
          teacherForm={teacherForm}
          teachers={teachers}
        />
      ) : null}

      {route.page === "detail" ? (
        <section className="pageGrid">
          <Section
            action={
              <button
                className="inlineButton"
                onClick={() =>
                  navigate(
                    route.type === "course"
                      ? "/courses"
                      : route.type === "student"
                        ? "/students"
                        : "/teachers",
                  )
                }
                type="button"
              >
                Volver
              </button>
            }
            title="Detalle individual"
          >
            {renderDetail()}
          </Section>
        </section>
      ) : null}

      {route.page === "notFound" ? (
        <section className="pageGrid">
          <Section title="Pagina no encontrada">
            <div className="emptyDetail">
              La ruta actual no existe. Vuelve al inicio para continuar.
            </div>
          </Section>
        </section>
      ) : null}
    </main>
  );
}

interface DashboardPageProps {
  courses: Course[];
  students: Student[];
  teachers: Teacher[];
  navigate: (path: string) => void;
}

function DashboardPage({
  courses,
  students,
  teachers,
  navigate,
}: DashboardPageProps) {
  return (
    <>
      <section className="metricsGrid">
        <Metric label="Estudiantes" value={students.length} />
        <Metric label="Docentes" value={teachers.length} />
        <Metric label="Cursos" value={courses.length} />
      </section>

      <section className="pageGrid threeColumns">
        <Section title="Cursos">
          <p className="sectionLead">Administra cursos y revisa cupos.</p>
          <button onClick={() => navigate("/courses")} type="button">
            Abrir cursos
          </button>
        </Section>
        <Section title="Estudiantes">
          <p className="sectionLead">Registra estudiantes y consulta detalles.</p>
          <button onClick={() => navigate("/students")} type="button">
            Abrir estudiantes
          </button>
        </Section>
        <Section title="Docentes">
          <p className="sectionLead">Gestiona docentes y sus asignaciones.</p>
          <button onClick={() => navigate("/teachers")} type="button">
            Abrir docentes
          </button>
        </Section>
      </section>
    </>
  );
}

interface CoursesPageProps {
  canCreateCourse: boolean;
  cancelEditingCourse: () => void;
  courseActionState: CourseActionState;
  courseForm: CourseFormState;
  courseTeacherFilter: string;
  courses: Course[];
  editCourseForm: CourseFormState;
  editingCourseId: string | null;
  handleCreateCourse: (event: FormEvent<HTMLFormElement>) => void;
  handleDeleteCourse: (course: Course) => void;
  handleUpdateCourse: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  navigate: (path: string) => void;
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>;
  setCourseTeacherFilter: Dispatch<SetStateAction<string>>;
  setEditCourseForm: Dispatch<SetStateAction<CourseFormState>>;
  startEditingCourse: (course: Course) => void;
  submitState: EntityType | null;
  teacherById: Map<string, Teacher>;
  teachers: Teacher[];
}

function CoursesPage({
  canCreateCourse,
  cancelEditingCourse,
  courseActionState,
  courseForm,
  courseTeacherFilter,
  courses,
  editCourseForm,
  editingCourseId,
  handleCreateCourse,
  handleDeleteCourse,
  handleUpdateCourse,
  isLoading,
  navigate,
  setCourseForm,
  setCourseTeacherFilter,
  setEditCourseForm,
  startEditingCourse,
  submitState,
  teacherById,
  teachers,
}: CoursesPageProps) {
  return (
    <section className="pageGrid twoColumns">
      <Section title="Crear curso">
        <form className="entityForm withoutDivider" onSubmit={handleCreateCourse}>
          <input
            minLength={3}
            onChange={(event) =>
              setCourseForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Nombre del curso"
            required
            value={courseForm.title}
          />
          <textarea
            minLength={10}
            onChange={(event) =>
              setCourseForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Descripcion"
            required
            value={courseForm.description}
          />
          <div className="formRow">
            <select
              disabled={teachers.length === 0}
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  teacherId: event.target.value,
                }))
              }
              required
              value={courseForm.teacherId}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <input
              min={1}
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  capacity: Number(event.target.value),
                }))
              }
              required
              type="number"
              value={courseForm.capacity}
            />
          </div>
          {teachers.length === 0 ? (
            <p className="helperText">Crea un docente antes de crear cursos.</p>
          ) : null}
          <button disabled={!canCreateCourse || submitState === "course"} type="submit">
            {submitState === "course" ? "Creando..." : "Crear curso"}
          </button>
        </form>
      </Section>

      <Section
        action={
          <select
            className="compactSelect"
            onChange={(event) => setCourseTeacherFilter(event.target.value)}
            value={courseTeacherFilter}
          >
            <option value="">Todos</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        }
        title="Cursos"
      >
        <div className="list">
          {isLoading ? <p>Cargando cursos...</p> : null}
          {!isLoading && courses.length === 0 ? (
            <div className="emptyDetail">No hay cursos para este filtro.</div>
          ) : null}
          {courses.map((course) => (
            <article className="item" key={course.id}>
              {editingCourseId === course.id ? (
                <form className="entityForm withoutDivider" onSubmit={handleUpdateCourse}>
                  <input
                    minLength={3}
                    onChange={(event) =>
                      setEditCourseForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    required
                    value={editCourseForm.title}
                  />
                  <textarea
                    minLength={10}
                    onChange={(event) =>
                      setEditCourseForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    required
                    value={editCourseForm.description}
                  />
                  <div className="formRow">
                    <select
                      onChange={(event) =>
                        setEditCourseForm((current) => ({
                          ...current,
                          teacherId: event.target.value,
                        }))
                      }
                      required
                      value={editCourseForm.teacherId}
                    >
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <input
                      min={1}
                      onChange={(event) =>
                        setEditCourseForm((current) => ({
                          ...current,
                          capacity: Number(event.target.value),
                        }))
                      }
                      required
                      type="number"
                      value={editCourseForm.capacity}
                    />
                  </div>
                  <div className="buttonRow">
                    <button
                      disabled={
                        courseActionState?.type === "update" &&
                        courseActionState.id === course.id
                      }
                      type="submit"
                    >
                      {courseActionState?.type === "update" &&
                      courseActionState.id === course.id
                        ? "Guardando..."
                        : "Guardar"}
                    </button>
                    <button
                      className="secondaryButton noMargin"
                      onClick={cancelEditingCourse}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Docente</dt>
                      <dd>
                        {teacherById.get(course.teacherId)?.name ??
                          course.teacherId}
                      </dd>
                    </div>
                    <div>
                      <dt>Cupos</dt>
                      <dd>{course.capacity}</dd>
                    </div>
                  </dl>
                  <div className="buttonRow">
                    <button
                      className="secondaryButton noMargin"
                      onClick={() => navigate(buildDetailPath("course", course.id))}
                      type="button"
                    >
                      Ver
                    </button>
                    <button
                      className="secondaryButton noMargin"
                      onClick={() => startEditingCourse(course)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="dangerButton"
                      disabled={
                        courseActionState?.type === "delete" &&
                        courseActionState.id === course.id
                      }
                      onClick={() => handleDeleteCourse(course)}
                      type="button"
                    >
                      {courseActionState?.type === "delete" &&
                      courseActionState.id === course.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </Section>
    </section>
  );
}

interface StudentsPageProps {
  handleCreateStudent: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  navigate: (path: string) => void;
  setStudentForm: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  studentForm: { name: string; email: string };
  students: Student[];
  submitState: EntityType | null;
}

function StudentsPage({
  handleCreateStudent,
  isLoading,
  navigate,
  setStudentForm,
  studentForm,
  students,
  submitState,
}: StudentsPageProps) {
  return (
    <section className="pageGrid twoColumns">
      <Section title="Crear estudiante">
        <form className="entityForm withoutDivider" onSubmit={handleCreateStudent}>
          <input
            minLength={2}
            onChange={(event) =>
              setStudentForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Nombre"
            required
            value={studentForm.name}
          />
          <input
            onChange={(event) =>
              setStudentForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="correo@dominio.com"
            required
            type="email"
            value={studentForm.email}
          />
          <button disabled={submitState === "student"} type="submit">
            {submitState === "student" ? "Creando..." : "Crear estudiante"}
          </button>
        </form>
      </Section>

      <Section title="Estudiantes">
        <div className="tableLike">
          {isLoading ? <p>Cargando estudiantes...</p> : null}
          {students.map((student) => (
            <div className="row" key={student.id}>
              <div>
                <strong>{student.name}</strong>
                <span>{student.email}</span>
              </div>
              <button
                className="inlineButton"
                onClick={() => navigate(buildDetailPath("student", student.id))}
                type="button"
              >
                Ver
              </button>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}

interface TeachersPageProps {
  handleCreateTeacher: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  navigate: (path: string) => void;
  setTeacherForm: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
      specialty: string;
    }>
  >;
  submitState: EntityType | null;
  teacherForm: { name: string; email: string; specialty: string };
  teachers: Teacher[];
}

function TeachersPage({
  handleCreateTeacher,
  isLoading,
  navigate,
  setTeacherForm,
  submitState,
  teacherForm,
  teachers,
}: TeachersPageProps) {
  return (
    <section className="pageGrid twoColumns">
      <Section title="Crear docente">
        <form className="entityForm withoutDivider" onSubmit={handleCreateTeacher}>
          <input
            minLength={2}
            onChange={(event) =>
              setTeacherForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Nombre"
            required
            value={teacherForm.name}
          />
          <input
            onChange={(event) =>
              setTeacherForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="correo@dominio.com"
            required
            type="email"
            value={teacherForm.email}
          />
          <input
            minLength={2}
            onChange={(event) =>
              setTeacherForm((current) => ({
                ...current,
                specialty: event.target.value,
              }))
            }
            placeholder="Especialidad"
            required
            value={teacherForm.specialty}
          />
          <button disabled={submitState === "teacher"} type="submit">
            {submitState === "teacher" ? "Creando..." : "Crear docente"}
          </button>
        </form>
      </Section>

      <Section title="Docentes">
        <div className="tableLike">
          {isLoading ? <p>Cargando docentes...</p> : null}
          {teachers.map((teacher) => (
            <div className="row" key={teacher.id}>
              <div>
                <strong>{teacher.name}</strong>
                <span>{teacher.specialty}</span>
              </div>
              <button
                className="inlineButton"
                onClick={() => navigate(buildDetailPath("teacher", teacher.id))}
                type="button"
              >
                Ver
              </button>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
