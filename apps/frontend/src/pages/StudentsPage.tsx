import type { Student } from "@courses/shared";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Section } from "../components/Section";
import { buildDetailPath } from "../routing/routes";
import type { EntityType, StudentActionState } from "../types/ui";

interface StudentsPageProps {
  cancelEditingStudent: () => void;
  editStudentForm: { name: string; email: string };
  editingStudentId: string | null;
  handleCreateStudent: (event: FormEvent<HTMLFormElement>) => void;
  handleDeleteStudent: (student: Student) => void;
  handleUpdateStudent: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  navigate: (path: string) => void;
  setEditStudentForm: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  setStudentForm: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  studentForm: { name: string; email: string };
  studentActionState: StudentActionState;
  students: Student[];
  submitState: EntityType | null;
  startEditingStudent: (student: Student) => void;
}

export function StudentsPage({
  cancelEditingStudent,
  editStudentForm,
  editingStudentId,
  handleCreateStudent,
  handleDeleteStudent,
  handleUpdateStudent,
  isLoading,
  navigate,
  setEditStudentForm,
  setStudentForm,
  studentForm,
  studentActionState,
  students,
  submitState,
  startEditingStudent,
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
            <article className="item" key={student.id}>
              {editingStudentId === student.id ? (
                <form className="entityForm withoutDivider" onSubmit={handleUpdateStudent}>
                  <input
                    minLength={2}
                    onChange={(event) =>
                      setEditStudentForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                    value={editStudentForm.name}
                  />
                  <input
                    onChange={(event) =>
                      setEditStudentForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                    type="email"
                    value={editStudentForm.email}
                  />
                  <div className="buttonRow twoButtons">
                    <button
                      disabled={
                        studentActionState?.type === "update" &&
                        studentActionState.id === student.id
                      }
                      type="submit"
                    >
                      {studentActionState?.type === "update" &&
                      studentActionState.id === student.id
                        ? "Guardando..."
                        : "Guardar"}
                    </button>
                    <button
                      className="secondaryButton noMargin"
                      onClick={cancelEditingStudent}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Cursos inscritos</dt>
                      <dd>{student.enrolledCourseIds.length}</dd>
                    </div>
                  </dl>
                  <div className="buttonRow">
                    <button
                      className="secondaryButton noMargin"
                      onClick={() =>
                        navigate(buildDetailPath("student", student.id))
                      }
                      type="button"
                    >
                      Ver
                    </button>
                    <button
                      className="secondaryButton noMargin"
                      onClick={() => startEditingStudent(student)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="dangerButton"
                      disabled={
                        studentActionState?.type === "delete" &&
                        studentActionState.id === student.id
                      }
                      onClick={() => handleDeleteStudent(student)}
                      type="button"
                    >
                      {studentActionState?.type === "delete" &&
                      studentActionState.id === student.id
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
