import type {
  Course,
  CourseResource,
  CourseSection,
  Quiz,
  QuizQuestion,
  Student,
  Teacher,
} from "@courses/shared";
import { useState, type Dispatch, type SetStateAction } from "react";
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
  QuizFormState,
  QuizQuestionFormState,
  DetailEntity,
  LoadState,
  StudentActionState,
} from "../types/ui";

interface DetailPageProps {
  courseById: Map<string, Course>;
  courseContentActionState: CourseContentActionState;
  courseResourceForms: Record<string, CourseResourceFormState>;
  courseResources: Record<string, CourseResource[]>;
  courseQuizzes: Record<string, Quiz[]>;
  courseQuizForms: Record<string, QuizFormState>;
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
  handleCreateCourseQuiz: (section: CourseSection) => void;
  handleDeleteCourseQuiz: (quiz: Quiz) => void;
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
  getQuizForm: (sectionId: string) => QuizFormState;
  setCourseQuizForm: (
    sectionId: string,
    updater:
      | QuizFormState
      | ((current: QuizFormState) => QuizFormState),
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
  courseQuizzes,
  courseQuizForms,
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
  handleCreateCourseQuiz,
  handleDeleteCourseQuiz,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  route,
  setCourseResourceForm,
  getQuizForm,
  setCourseQuizForm,
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
          courseQuizzes={courseQuizzes}
          courseQuizForms={courseQuizForms}
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
          handleCreateCourseQuiz={handleCreateCourseQuiz}
          handleDeleteCourseQuiz={handleDeleteCourseQuiz}
          handleEnrollStudent={handleEnrollStudent}
          handleUnenrollStudent={handleUnenrollStudent}
          navigate={navigate}
          setCourseResourceForm={setCourseResourceForm}
          getQuizForm={getQuizForm}
          setCourseQuizForm={setCourseQuizForm}
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
  courseQuizzes,
  courseQuizForms,
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
  handleCreateCourseQuiz,
  handleDeleteCourseQuiz,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  setCourseResourceForm,
  getQuizForm,
  setCourseQuizForm,
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
        courseQuizzes={courseQuizzes}
        courseQuizForms={courseQuizForms}
        courseSectionForm={courseSectionForm}
        courseSections={courseSections}
        enrollmentState={enrollmentState}
        enrollmentStudentId={enrollmentStudentId}
        handleCreateCourseResource={handleCreateCourseResource}
        handleCreateCourseSection={handleCreateCourseSection}
        handleDeleteCourseResource={handleDeleteCourseResource}
        handleDeleteCourseSection={handleDeleteCourseSection}
        handleCreateCourseQuiz={handleCreateCourseQuiz}
        handleDeleteCourseQuiz={handleDeleteCourseQuiz}
        handleEnrollStudent={handleEnrollStudent}
        handleUnenrollStudent={handleUnenrollStudent}
        navigate={navigate}
        setCourseResourceForm={setCourseResourceForm}
        getQuizForm={getQuizForm}
        setCourseQuizForm={setCourseQuizForm}
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
  courseQuizzes: Record<string, Quiz[]>;
  courseQuizForms: Record<string, QuizFormState>;
  courseSectionForm: CourseSectionFormState;
  courseSections: CourseSection[];
  enrollmentState: boolean;
  enrollmentStudentId: string;
  handleCreateCourseResource: (section: CourseSection) => void;
  handleCreateCourseSection: (course: Course) => void;
  handleDeleteCourseResource: (resource: CourseResource) => void;
  handleDeleteCourseSection: (section: CourseSection) => void;
  handleCreateCourseQuiz: (section: CourseSection) => void;
  handleDeleteCourseQuiz: (quiz: Quiz) => void;
  handleEnrollStudent: (course: Course) => void;
  handleUnenrollStudent: (course: Course, student: Student) => void;
  navigate: (path: string) => void;
  setCourseResourceForm: (
    sectionId: string,
    updater:
      | CourseResourceFormState
      | ((current: CourseResourceFormState) => CourseResourceFormState),
  ) => void;
  getQuizForm: (sectionId: string) => QuizFormState;
  setCourseQuizForm: (
    sectionId: string,
    updater:
      | QuizFormState
      | ((current: QuizFormState) => QuizFormState),
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
  courseQuizzes,
  courseQuizForms,
  courseSectionForm,
  courseSections,
  enrollmentState,
  enrollmentStudentId,
  handleCreateCourseResource,
  handleCreateCourseSection,
  handleDeleteCourseResource,
  handleDeleteCourseSection,
  handleCreateCourseQuiz,
  handleDeleteCourseQuiz,
  handleEnrollStudent,
  handleUnenrollStudent,
  navigate,
  setCourseResourceForm,
  getQuizForm,
  setCourseQuizForm,
  setCourseSectionForm,
  setEnrollmentStudentId,
  studentActionState,
  students,
  teacher,
}: CourseDetailProps) {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [activeQuizCreateSectionId, setActiveQuizCreateSectionId] = useState<string | null>(null);

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

                {/* Seccion de Cuestionarios */}
                <div className="quizSection">
                  <div className="quizSectionHeader">
                    <h5>Cuestionarios</h5>
                    <button
                      className="inlineButton textButton"
                      onClick={() =>
                        setActiveQuizCreateSectionId((current) =>
                          current === section.id ? null : section.id
                        )
                      }
                      type="button"
                    >
                      {activeQuizCreateSectionId === section.id
                        ? "Cancelar creación"
                        : "+ Nuevo Cuestionario"}
                    </button>
                  </div>

                  {/* Listado de Cuestionarios */}
                  <div className="quizList">
                    {(courseQuizzes[section.id] ?? []).length === 0 ? (
                      <p className="helperText">Sin cuestionarios creados.</p>
                    ) : null}
                    {(courseQuizzes[section.id] ?? []).map((quiz) => {
                      const isExpanded = expandedQuizId === quiz.id;
                      return (
                        <div className="quizItem" key={quiz.id}>
                          <div className="quizHeader">
                            <div className="quizInfo">
                              <h4>{quiz.title}</h4>
                              {quiz.description ? <p>{quiz.description}</p> : null}
                            </div>
                            <div className="rowActions">
                              <button
                                className="inlineButton"
                                onClick={() =>
                                  setExpandedQuizId(isExpanded ? null : quiz.id)
                                }
                                type="button"
                              >
                                {isExpanded ? "Ocultar preguntas" : "Ver preguntas"}
                              </button>
                              <button
                                className="dangerButton inlineButton"
                                disabled={
                                  courseContentActionState?.type === "delete-quiz" &&
                                  courseContentActionState.id === quiz.id
                                }
                                onClick={() => handleDeleteCourseQuiz(quiz)}
                                type="button"
                              >
                                {courseContentActionState?.type === "delete-quiz" &&
                                courseContentActionState.id === quiz.id
                                  ? "Eliminando..."
                                  : "Eliminar"}
                              </button>
                            </div>
                          </div>

                          {/* Preguntas del Cuestionario */}
                          {isExpanded ? (
                            <div className="quizQuestionsPreview">
                              {quiz.questions.map((q, qIndex) => (
                                <div className="previewQuestion" key={qIndex}>
                                  <div className="previewQuestionText">
                                    {qIndex + 1}. {q.question}
                                  </div>
                                  <div className="previewOptions">
                                    {q.options.map((opt, optIndex) => (
                                      <div
                                        className={`previewOption ${
                                          optIndex === q.correctAnswer ? "isCorrect" : ""
                                        }`}
                                        key={optIndex}
                                      >
                                        {optIndex === q.correctAnswer ? "✓ " : ""}{opt}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulario de creación de cuestionario */}
                  {activeQuizCreateSectionId === section.id ? (
                    <form
                      className="quizForm"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleCreateCourseQuiz(section);
                        setActiveQuizCreateSectionId(null);
                      }}
                    >
                      <h4>Crear Nuevo Cuestionario</h4>
                      <input
                        minLength={3}
                        onChange={(event) =>
                          setCourseQuizForm(section.id, (current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Título del cuestionario"
                        required
                        value={getQuizForm(section.id).title}
                      />
                      <textarea
                        onChange={(event) =>
                          setCourseQuizForm(section.id, (current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Descripción breve"
                        value={getQuizForm(section.id).description}
                      />

                      <div className="questionsContainer">
                        <h5>Preguntas</h5>
                        {getQuizForm(section.id).questions.map((q, qIndex) => (
                          <div className="questionCard" key={qIndex}>
                            <div className="questionHeader">
                              <span className="questionTitle">Pregunta #{qIndex + 1}</span>
                              {getQuizForm(section.id).questions.length > 1 ? (
                                <button
                                  className="dangerButton inlineButton"
                                  onClick={() =>
                                    setCourseQuizForm(section.id, (current) => ({
                                      ...current,
                                      questions: current.questions.filter((_, idx) => idx !== qIndex),
                                    }))
                                  }
                                  type="button"
                                >
                                  Eliminar
                                </button>
                              ) : null}
                            </div>

                            <input
                              onChange={(event) =>
                                setCourseQuizForm(section.id, (current) => {
                                  const questions = [...current.questions];
                                  questions[qIndex] = {
                                    ...questions[qIndex],
                                    question: event.target.value,
                                  };
                                  return { ...current, questions };
                                })
                              }
                              placeholder="Enunciado de la pregunta"
                              required
                              value={q.question}
                            />

                            <div className="optionsGrid">
                              {q.options.map((opt, optIndex) => (
                                <div className="optionInputGroup" key={optIndex}>
                                  <input
                                    className="optionRadio"
                                    checked={q.correctAnswer === optIndex}
                                    name={`correctAnswer-${section.id}-${qIndex}`}
                                    onChange={() =>
                                      setCourseQuizForm(section.id, (current) => {
                                        const questions = [...current.questions];
                                        questions[qIndex] = {
                                          ...questions[qIndex],
                                          correctAnswer: optIndex,
                                        };
                                        return { ...current, questions };
                                      })
                                    }
                                    type="radio"
                                  />
                                  <input
                                    onChange={(event) =>
                                      setCourseQuizForm(section.id, (current) => {
                                        const questions = [...current.questions];
                                        const options = [...questions[qIndex].options];
                                        options[optIndex] = event.target.value;
                                        questions[qIndex] = {
                                          ...questions[qIndex],
                                          options,
                                        };
                                        return { ...current, questions };
                                      })
                                    }
                                    placeholder={`Opción ${String.fromCharCode(65 + optIndex)}`}
                                    required
                                    value={opt}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="buttonRow twoButtons">
                        <button
                          className="secondaryButton noMargin"
                          onClick={() =>
                            setCourseQuizForm(section.id, (current) => ({
                              ...current,
                              questions: [
                                ...current.questions,
                                {
                                  question: "",
                                  options: ["", "", "", ""],
                                  correctAnswer: 0,
                                },
                              ],
                            }))
                          }
                          type="button"
                        >
                          + Agregar Pregunta
                        </button>
                        <button
                          disabled={
                            courseContentActionState?.type === "create-quiz" &&
                            courseContentActionState.id === section.id
                          }
                          type="submit"
                        >
                          {courseContentActionState?.type === "create-quiz" &&
                          courseContentActionState.id === section.id
                            ? "Guardando..."
                            : "Guardar Cuestionario"}
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>
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
