import type { Student } from "@courses/shared";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Section } from "../components/Section";
import { buildDetailPath } from "../routing/routes";
import type { EntityType } from "../types/ui";

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

export function StudentsPage({
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

