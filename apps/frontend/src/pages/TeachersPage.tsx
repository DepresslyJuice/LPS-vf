import type { Teacher } from "@courses/shared";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Section } from "../components/Section";
import { buildDetailPath } from "../routing/routes";
import type { EntityType } from "../types/ui";

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

export function TeachersPage({
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
