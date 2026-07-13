import type {
  Course,
  CourseResource,
  CourseSection,
  Student,
  Teacher,
} from "@courses/shared";
import type { Dispatch, SetStateAction } from "react";
import { Section } from "../components/Section";
import {
  buildDetailPath,
  entityLabels,
  type Route,
} from "../routing/routes";
import type {
  CourseContentActionState,
  CourseResourceFormState,
  CourseSectionFormState,
  DetailEntity,
  LoadState,
  StudentActionState,
} from "../types/ui";

interface DetailPageProps {
  courseById: Map<string, Course>;
  courseContentActionState: CourseContentActionState;
  courseResourceForms: Record<string, CourseResourceFormState>;
  courseResources: Record<string, CourseResource[]>;
  courseSectionForm: CourseSectionFormState;
  courseSections: CourseSection[];
  courses: Course[];
  detailEntity: DetailEntity | null;
  detailState: LoadState;
  enrollmentState: boolean;
  enrollmentStudentId: string;
  handleCreateCourseResource: (section: CourseSection) => void;
  handleCreateCourseSection: (course: Course) => void;
  handleDeleteCourseResource: (resource: CourseResource) => void;
  handleDeleteCourseSection: (section: CourseSection) => void;
  handleEnrollStudent: (course: Course) => void;
  handleUnenrollStudent: (course: Course, student: Student) => void;
  navigate: (path: string) => void;
  route: Extract<Route, { page: "detail" }>;
  setCourseResourceForm: (
    sectionId: string,
    updater:
      | CourseResourceFormState
      | ((current: CourseResourceFormState) => CourseResourceFormState),
  ) => void;
  setCourseSectionForm: Dispatch<SetStateAction<CourseSectionFormState>>;
  setEnrollmentStudentId: (studentId: string) => void;
  studentActionState: StudentActionState;
  students: Student[];
  teacherById: Map<string, Teacher>;
}

export function DetailPage({
  courseById,
  courseContentActionState,
  courseResourceForms,
  courseResources,
  courseSectionForm,
  courseSections,
  courses,
  detailEntity,
  detailState,
  enrollmentState,
  enrollmentStudentId,
  handleCreateCourseResource,
  handleCreateCourseSection,
  handleDeleteCourseResource,
  handleDeleteCourseSection,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  route,
  setCourseResourceForm,
  setCourseSectionForm,
  setEnrollmentStudentId,
  studentActionState,
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
          courseContentActionState={courseContentActionState}
          courseResourceForms={courseResourceForms}
          courseResources={courseResources}
          courseSectionForm={courseSectionForm}
          courseSections={courseSections}
          courses={courses}
          detailEntity={detailEntity}
          detailState={detailState}
          enrollmentState={enrollmentState}
          enrollmentStudentId={enrollmentStudentId}
          handleCreateCourseResource={handleCreateCourseResource}
          handleCreateCourseSection={handleCreateCourseSection}
          handleDeleteCourseResource={handleDeleteCourseResource}
          handleDeleteCourseSection={handleDeleteCourseSection}
          handleEnrollStudent={handleEnrollStudent}
          handleUnenrollStudent={handleUnenrollStudent}
          navigate={navigate}
          setCourseResourceForm={setCourseResourceForm}
          setCourseSectionForm={setCourseSectionForm}
          setEnrollmentStudentId={setEnrollmentStudentId}
          studentActionState={studentActionState}
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
  courseContentActionState,
  courseResourceForms,
  courseResources,
  courseSectionForm,
  courseSections,
  courses,
  detailEntity,
  detailState,
  enrollmentState,
  enrollmentStudentId,
  handleCreateCourseResource,
  handleCreateCourseSection,
  handleDeleteCourseResource,
  handleDeleteCourseSection,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  setCourseResourceForm,
  setCourseSectionForm,
  setEnrollmentStudentId,
  studentActionState,
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
        courseContentActionState={courseContentActionState}
        courseResourceForms={courseResourceForms}
        courseResources={courseResources}
        courseSectionForm={courseSectionForm}
        courseSections={courseSections}
        enrollmentState={enrollmentState}
        enrollmentStudentId={enrollmentStudentId}
        handleCreateCourseResource={handleCreateCourseResource}
        handleCreateCourseSection={handleCreateCourseSection}
        handleDeleteCourseResource={handleDeleteCourseResource}
        handleDeleteCourseSection={handleDeleteCourseSection}
        handleEnrollStudent={handleEnrollStudent}
        handleUnenrollStudent={handleUnenrollStudent}
        navigate={navigate}
        setCourseResourceForm={setCourseResourceForm}
        setCourseSectionForm={setCourseSectionForm}
        setEnrollmentStudentId={setEnrollmentStudentId}
        studentActionState={studentActionState}
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
  courseContentActionState: CourseContentActionState;
  courseResourceForms: Record<string, CourseResourceFormState>;
  courseResources: Record<string, CourseResource[]>;
  courseSectionForm: CourseSectionFormState;
  courseSections: CourseSection[];
  enrollmentState: boolean;
  enrollmentStudentId: string;
  handleCreateCourseResource: (section: CourseSection) => void;
  handleCreateCourseSection: (course: Course) => void;
  handleDeleteCourseResource: (resource: CourseResource) => void;
  handleDeleteCourseSection: (section: CourseSection) => void;
  handleEnrollStudent: (course: Course) => void;
  handleUnenrollStudent: (course: Course, student: Student) => void;
  navigate: (path: string) => void;
  setCourseResourceForm: (
    sectionId: string,
    updater:
      | CourseResourceFormState
      | ((current: CourseResourceFormState) => CourseResourceFormState),
  ) => void;
  setCourseSectionForm: Dispatch<SetStateAction<CourseSectionFormState>>;
  setEnrollmentStudentId: (studentId: string) => void;
  studentActionState: StudentActionState;
  students: Student[];
  teacher: Teacher | undefined;
}

function CourseDetail({
  course,
  courseContentActionState,
  courseResourceForms,
  courseResources,
  courseSectionForm,
  courseSections,
  enrollmentState,
  enrollmentStudentId,
  handleCreateCourseResource,
  handleCreateCourseSection,
  handleDeleteCourseResource,
  handleDeleteCourseSection,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  setCourseResourceForm,
  setCourseSectionForm,
  setEnrollmentStudentId,
  studentActionState,
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
        <div>
          <dt>Estado</dt>
          <dd>
            {course.status === "draft"
              ? "Borrador"
              : course.status === "published"
                ? "Publicado"
                : "Archivado"}
          </dd>
        </div>
      </dl>
      <div className="courseContentPanel">
        <h4>Contenido del curso</h4>
        <form
          className="entityForm withoutDivider"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateCourseSection(course);
          }}
        >
          <input
            minLength={3}
            onChange={(event) =>
              setCourseSectionForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="Titulo de seccion"
            required
            value={courseSectionForm.title}
          />
          <textarea
            onChange={(event) =>
              setCourseSectionForm((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            placeholder="Resumen breve"
            value={courseSectionForm.summary}
          />
          <div className="formRow">
            <input
              min={1}
              onChange={(event) =>
                setCourseSectionForm((current) => ({
                  ...current,
                  order: Number(event.target.value),
                }))
              }
              required
              type="number"
              value={courseSectionForm.order}
            />
            <button
              disabled={courseContentActionState?.type === "create-section"}
              type="submit"
            >
              {courseContentActionState?.type === "create-section"
                ? "Creando..."
                : "Crear seccion"}
            </button>
          </div>
        </form>

        <div className="list">
          {courseSections.length === 0 ? (
            <div className="emptyDetail">Sin secciones creadas.</div>
          ) : null}
          {courseSections.map((section) => {
            const resourceForm =
              courseResourceForms[section.id] ?? {
                title: "",
                type: "link" as const,
                url: "",
                content: "",
              };
            const resources = courseResources[section.id] ?? [];

            return (
              <article className="item" key={section.id}>
                <div className="titleRow">
                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.summary || "Sin resumen"}</p>
                  </div>
                  <span className="statusBadge">Orden {section.order}</span>
                </div>
                <div className="resourceList">
                  {resources.length === 0 ? (
                    <p className="helperText">Sin recursos.</p>
                  ) : null}
                  {resources.map((resource) => (
                    <div className="row" key={resource.id}>
                      <div>
                        <strong>{resource.title}</strong>
                        <span>
                          {resource.type === "link"
                            ? resource.url
                            : resource.content}
                        </span>
                      </div>
                      <button
                        className="dangerButton inlineButton"
                        disabled={
                          courseContentActionState?.type ===
                            "delete-resource" &&
                          courseContentActionState.id === resource.id
                        }
                        onClick={() => handleDeleteCourseResource(resource)}
                        type="button"
                      >
                        {courseContentActionState?.type === "delete-resource" &&
                        courseContentActionState.id === resource.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  className="entityForm withoutDivider"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleCreateCourseResource(section);
                  }}
                >
                  <input
                    minLength={3}
                    onChange={(event) =>
                      setCourseResourceForm(section.id, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Titulo del recurso"
                    required
                    value={resourceForm.title}
                  />
                  <div className="formRow">
                    <select
                      onChange={(event) =>
                        setCourseResourceForm(section.id, (current) => ({
                          ...current,
                          type: event.target.value as CourseResource["type"],
                        }))
                      }
                      value={resourceForm.type}
                    >
                      <option value="link">Enlace</option>
                      <option value="text">Texto</option>
                    </select>
                    <input
                      onChange={(event) =>
                        setCourseResourceForm(section.id, (current) => ({
                          ...current,
                          url: event.target.value,
                          content: event.target.value,
                        }))
                      }
                      placeholder={
                        resourceForm.type === "link"
                          ? "https://..."
                          : "Contenido breve"
                      }
                      required
                      type={resourceForm.type === "link" ? "url" : "text"}
                      value={
                        resourceForm.type === "link"
                          ? resourceForm.url
                          : resourceForm.content
                      }
                    />
                  </div>
                  <div className="buttonRow twoButtons">
                    <button
                      disabled={
                        courseContentActionState?.type === "create-resource" &&
                        courseContentActionState.id === section.id
                      }
                      type="submit"
                    >
                      {courseContentActionState?.type === "create-resource" &&
                      courseContentActionState.id === section.id
                        ? "Agregando..."
                        : "Agregar recurso"}
                    </button>
                    <button
                      className="dangerButton"
                      disabled={
                        courseContentActionState?.type === "delete-section" &&
                        courseContentActionState.id === section.id
                      }
                      onClick={() => handleDeleteCourseSection(section)}
                      type="button"
                    >
                      {courseContentActionState?.type === "delete-section" &&
                      courseContentActionState.id === section.id
                        ? "Eliminando..."
                        : "Eliminar seccion"}
                    </button>
                  </div>
                </form>
              </article>
            );
          })}
        </div>
      </div>
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
              <div className="rowActions">
                <button
                  className="inlineButton"
                  onClick={() =>
                    navigate(buildDetailPath("student", student.id))
                  }
                  type="button"
                >
                  Ver
                </button>
                <button
                  className="dangerButton inlineButton"
                  disabled={
                    studentActionState?.type === "unenroll" &&
                    studentActionState.id === student.id
                  }
                  onClick={() => handleUnenrollStudent(course, student)}
                  type="button"
                >
                  {studentActionState?.type === "unenroll" &&
                  studentActionState.id === student.id
                    ? "Retirando..."
                    : "Retirar"}
                </button>
              </div>
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
