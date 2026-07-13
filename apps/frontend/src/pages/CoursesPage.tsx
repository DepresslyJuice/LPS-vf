import type { Course, Teacher } from "@courses/shared";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Section } from "../components/Section";
import { buildDetailPath } from "../routing/routes";
import type {
  CourseActionState,
  CourseFormState,
  EntityType,
} from "../types/ui";

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

export function CoursesPage({
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
