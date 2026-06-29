import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Course, Student, Teacher } from "@courses/shared";
import { Metric } from "../components/Metric";
import { Section } from "../components/Section";
import { api } from "../services/api";

type LoadState = "idle" | "loading" | "ready" | "error";
type EntityType = "course" | "student" | "teacher";
type DetailSelection = { type: EntityType; id: string };
type DetailEntity =
  | { type: "course"; data: Course }
  | { type: "student"; data: Student }
  | { type: "teacher"; data: Teacher };

const entityLabels: Record<EntityType, string> = {
  course: "Curso",
  student: "Estudiante",
  teacher: "Docente",
};

export function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [selectedDetail, setSelectedDetail] = useState<DetailSelection | null>(
    null,
  );
  const [detailEntity, setDetailEntity] = useState<DetailEntity | null>(null);
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [studentForm, setStudentForm] = useState({ name: "", email: "" });
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    specialty: "",
  });
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    teacherId: "teacher_luis",
    capacity: 25,
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
    if (!selectedDetail) {
      setDetailEntity(null);
      setDetailState("idle");
      return;
    }

    setDetailState("loading");
    const detailRequest =
      selectedDetail.type === "course"
        ? api
            .getCourse(selectedDetail.id)
            .then((data): DetailEntity => ({ type: "course", data }))
        : selectedDetail.type === "student"
          ? api
              .getStudent(selectedDetail.id)
              .then((data): DetailEntity => ({ type: "student", data }))
          : api
              .getTeacher(selectedDetail.id)
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
  }, [selectedDetail]);

  const teacherById = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers],
  );
  const courseById = useMemo(
    () => new Map(courses.map((course) => [course.id, course])),
    [courses],
  );

  const isLoading = loadState === "loading" || loadState === "idle";

  async function handleCreateStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await api.createStudent(studentForm);
    setStudents((current) => [...current, created]);
    setStudentForm({ name: "", email: "" });
    setSelectedDetail({ type: "student", id: created.id });
  }

  async function handleCreateTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await api.createTeacher(teacherForm);
    setTeachers((current) => [...current, created]);
    setTeacherForm({ name: "", email: "", specialty: "" });
    setCourseForm((current) => ({ ...current, teacherId: created.id }));
    setSelectedDetail({ type: "teacher", id: created.id });
  }

  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await api.createCourse(courseForm);
    setCourses((current) => [...current, created]);
    setCourseForm({
      title: "",
      description: "",
      teacherId: teachers[0]?.id ?? "",
      capacity: 25,
    });
    setSelectedDetail({ type: "course", id: created.id });
  }

  function renderDetail() {
    if (!selectedDetail) {
      return (
        <div className="emptyDetail">
          Selecciona un registro para ver su informacion individual.
        </div>
      );
    }

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
              <dd>{course.capacity}</dd>
            </div>
          </dl>
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

      <section className="metricsGrid">
        <Metric label="Estudiantes" value={students.length} />
        <Metric label="Docentes" value={teachers.length} />
        <Metric label="Cursos" value={courses.length} />
      </section>

      {loadState === "error" ? (
        <div className="notice">
          No se pudo conectar con la API. Inicia el backend en
          http://localhost:3000/api.
        </div>
      ) : null}

      <div className="contentGrid">
        <Section title="Detalle individual">{renderDetail()}</Section>

        <Section title="Cursos">
          <form className="entityForm" onSubmit={handleCreateCourse}>
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
            <button type="submit">Crear curso</button>
          </form>

          <div className="list">
            {isLoading ? <p>Cargando cursos...</p> : null}
            {courses.map((course) => (
              <article className="item" key={course.id}>
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
                <button
                  className="secondaryButton"
                  onClick={() =>
                    setSelectedDetail({ type: "course", id: course.id })
                  }
                  type="button"
                >
                  Ver detalle
                </button>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Estudiantes">
          <form className="entityForm" onSubmit={handleCreateStudent}>
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
            <button type="submit">Crear estudiante</button>
          </form>

          <div className="tableLike">
            {students.map((student) => (
              <div className="row" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <span>{student.email}</span>
                </div>
                <button
                  className="inlineButton"
                  onClick={() =>
                    setSelectedDetail({ type: "student", id: student.id })
                  }
                  type="button"
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Docentes">
          <form className="entityForm" onSubmit={handleCreateTeacher}>
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
            <button type="submit">Crear docente</button>
          </form>

          <div className="tableLike">
            {teachers.map((teacher) => (
              <div className="row" key={teacher.id}>
                <div>
                  <strong>{teacher.name}</strong>
                  <span>{teacher.specialty}</span>
                </div>
                <button
                  className="inlineButton"
                  onClick={() =>
                    setSelectedDetail({ type: "teacher", id: teacher.id })
                  }
                  type="button"
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
