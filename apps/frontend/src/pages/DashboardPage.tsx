import type { Course, Student, Teacher } from "@courses/shared";
import { Metric } from "../components/Metric";
import { Section } from "../components/Section";
import type { User } from "../hooks/AuthProvider";

interface DashboardPageProps {
  courses: Course[];
  students: Student[];
  teachers: Teacher[];
  navigate: (path: string) => void;
  user: User;
}

export function DashboardPage({
  courses,
  students,
  teachers,
  navigate,
  user,
}: DashboardPageProps) {
  const isStudent = user.roles.includes("estudiante") && !user.roles.includes("admin") && !user.roles.includes("tutor");
  const isTutor = user.roles.includes("tutor") && !user.roles.includes("admin");

  if (isStudent) {
    return (
      <>
        <section className="metricsGrid">
          <div className="item">
            <h3>¡Bienvenido a la plataforma!</h3>
            <p>{user.nombre}</p>
          </div>
        </section>
        <section className="pageGrid">
          <Section title="Mis Cursos">
            <p className="sectionLead">Accede a tus cursos matriculados y el contenido de estudio.</p>
            <button onClick={() => navigate("/courses")} type="button">
              Ver mis cursos
            </button>
          </Section>
        </section>
      </>
    );
  }

  if (isTutor) {
    const myTeacher = teachers.find(t => t.email === user.email);
    const myCourses = myTeacher ? courses.filter(c => c.teacherId === myTeacher.id) : [];
    
    return (
      <>
        <section className="metricsGrid">
          <Metric label="Mis Cursos" value={myCourses.length} />
        </section>
        <section className="pageGrid">
          <Section title="Cursos Asignados">
            <p className="sectionLead">Gestiona el contenido y cuestionarios de los cursos que impartes.</p>
            <button onClick={() => navigate("/courses")} type="button">
              Gestionar cursos
            </button>
          </Section>
        </section>
      </>
    );
  }

  // Admin Dashboard
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

