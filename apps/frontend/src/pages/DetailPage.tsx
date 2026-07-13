import type { Course, Student, Teacher } from "@courses/shared";
import { Section } from "../components/Section";
import {
  buildDetailPath,
  entityLabels,
  type Route,
} from "../routing/routes";
import type { DetailEntity, LoadState } from "../types/ui";

interface DetailPageProps {
  courseById: Map<string, Course>;
  courses: Course[];
  detailEntity: DetailEntity | null;
  detailState: LoadState;
  enrollmentState: boolean;
  enrollmentStudentId: string;
  handleEnrollStudent: (course: Course) => void;
  navigate: (path: string) => void;
  route: Extract<Route, { page: "detail" }>;
  setEnrollmentStudentId: (studentId: string) => void;
  students: Student[];
  teacherById: Map<string, Teacher>;
}

export function DetailPage({
  courseById,
  courses,
  detailEntity,
  detailState,
  enrollmentState,
  enrollmentStudentId,
  handleEnrollStudent,
  navigate,
  route,
  setEnrollmentStudentId,
  students,
  teacherById,
}: DetailPageProps) {
  return (
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
        <DetailContent
          courseById={courseById}
          courses={courses}
          detailEntity={detailEntity}
          detailState={detailState}
          enrollmentState={enrollmentState}
          enrollmentStudentId={enrollmentStudentId}
          handleEnrollStudent={handleEnrollStudent}
          navigate={navigate}
          setEnrollmentStudentId={setEnrollmentStudentId}
          students={students}
          teacherById={teacherById}
        />
      </Section>
    </section>
  );
}

interface DetailContentProps
  extends Omit<DetailPageProps, "route"> {}

function DetailContent({
  courseById,
  courses,
  detailEntity,
  detailState,
  enrollmentState,
  enrollmentStudentId,
  handleEnrollStudent,
  navigate,
  setEnrollmentStudentId,
  students,
  teacherById,
}: DetailContentProps) {
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
    return (
      <CourseDetail
        course={detailEntity.data}
        enrollmentState={enrollmentState}
        enrollmentStudentId={enrollmentStudentId}
        handleEnrollStudent={handleEnrollStudent}
        navigate={navigate}
        setEnrollmentStudentId={setEnrollmentStudentId}
        students={students}
        teacher={teacherById.get(detailEntity.data.teacherId)}
      />
    );
  }

  if (detailEntity.type === "student") {
    return (
      <StudentDetail courseById={courseById} student={detailEntity.data} />
    );
  }

  return (
    <TeacherDetail
      courses={courses}
      teacher={detailEntity.data}
    />
  );
}

interface CourseDetailProps {
  course: Course;
  enrollmentState: boolean;
  enrollmentStudentId: string;
  handleEnrollStudent: (course: Course) => void;
  navigate: (path: string) => void;
  setEnrollmentStudentId: (studentId: string) => void;
  students: Student[];
  teacher: Teacher | undefined;
}

function CourseDetail({
  course,
  enrollmentState,
  enrollmentStudentId,
  handleEnrollStudent,
  navigate,
  setEnrollmentStudentId,
  students,
  teacher,
}: CourseDetailProps) {
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
                onClick={() => navigate(buildDetailPath("student", student.id))}
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

interface StudentDetailProps {
  courseById: Map<string, Course>;
  student: Student;
}

function StudentDetail({ courseById, student }: StudentDetailProps) {
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

interface TeacherDetailProps {
  courses: Course[];
  teacher: Teacher;
}

function TeacherDetail({ courses, teacher }: TeacherDetailProps) {
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
