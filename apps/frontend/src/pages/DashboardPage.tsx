import type { Course, Student, Teacher } from "@courses/shared";
import { Metric } from "../components/Metric";
import { Section } from "../components/Section";

interface DashboardPageProps {
  courses: Course[];
  students: Student[];
  teachers: Teacher[];
  navigate: (path: string) => void;
}

export function DashboardPage({
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

