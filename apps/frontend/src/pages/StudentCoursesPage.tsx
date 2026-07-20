import { useEffect, useState } from "react";
import type { Course, CourseSection, CourseResource } from "@courses/shared";
import { api } from "../services/api";
import { useAuth } from "../hooks/AuthProvider";
import { Section } from "../components/Section";

interface CourseWithContent {
  course: Course;
  sections: Array<{
    section: CourseSection;
    resources: CourseResource[];
  }>;
}

export function StudentCoursesPage() {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState<CourseWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    api
      .getMyStudentCourses(user.email)
      .then((data) => {
        setCoursesData(data);
        // Expandir el primer curso automáticamente
        if (data.length > 0) {
          setExpandedCourseId(data[0].course.id);
        }
      })
      .catch(() => setError("No se pudieron cargar tus cursos. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const statusLabel: Record<string, string> = {
    draft: "Borrador",
    published: "Publicado",
    archived: "Archivado",
  };

  if (loading) {
    return (
      <section className="pageGrid">
        <div className="emptyDetail">Cargando tus cursos...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pageGrid">
        <div className="notice">{error}</div>
      </section>
    );
  }

  if (coursesData.length === 0) {
    return (
      <section className="pageGrid">
        <Section title="Mis cursos">
          <div className="emptyDetail">
            Aún no estás inscrito en ningún curso. Contacta a tu docente o administrador para inscribirte.
          </div>
        </Section>
      </section>
    );
  }

  return (
    <section className="pageGrid">
      <Section title={`Mis cursos (${coursesData.length})`}>
        <div className="tableLike">
          {coursesData.map(({ course, sections }) => {
            const isExpanded = expandedCourseId === course.id;
            const totalResources = sections.reduce(
              (acc, s) => acc + s.resources.length,
              0,
            );

            return (
              <article className="item studentCourseCard" key={course.id}>
                {/* Encabezado del curso */}
                <div className="studentCourseHeader">
                  <div className="studentCourseInfo">
                    <div className="titleRow">
                      <h3>{course.title}</h3>
                      <span className={`statusBadge statusBadge-${course.status}`}>
                        {statusLabel[course.status] ?? course.status}
                      </span>
                    </div>
                    <p>{course.description}</p>
                    <dl>
                      <div>
                        <dt>Secciones</dt>
                        <dd>{sections.length}</dd>
                      </div>
                      <div>
                        <dt>Recursos</dt>
                        <dd>{totalResources}</dd>
                      </div>
                      <div>
                        <dt>Capacidad</dt>
                        <dd>{course.capacity} estudiantes</dd>
                      </div>
                    </dl>
                  </div>
                  <button
                    className="secondaryButton noMargin studentExpandBtn"
                    onClick={() =>
                      setExpandedCourseId(isExpanded ? null : course.id)
                    }
                    type="button"
                  >
                    {isExpanded ? "▲ Cerrar" : "▼ Ver contenido"}
                  </button>
                </div>

                {/* Contenido expandido: secciones y recursos */}
                {isExpanded && (
                  <div className="studentCourseContent">
                    {sections.length === 0 ? (
                      <p className="helperText">Este curso aún no tiene secciones disponibles.</p>
                    ) : (
                      sections
                        .slice()
                        .sort((a, b) => a.section.order - b.section.order)
                        .map(({ section, resources }) => (
                          <div className="studentSection" key={section.id}>
                            <div className="studentSectionHeader">
                              <span className="studentSectionNumber">
                                {section.order}
                              </span>
                              <div>
                                <h4>{section.title}</h4>
                                {section.summary && (
                                  <p className="helperText">{section.summary}</p>
                                )}
                              </div>
                            </div>

                            {resources.length > 0 ? (
                              <div className="resourceList studentResourceList">
                                {resources.map((resource) => (
                                  <div className="studentResource" key={resource.id}>
                                    <span className="resourceTypeTag">
                                      {resource.type === "link" ? "🔗" : "📄"}
                                    </span>
                                    <div className="studentResourceBody">
                                      <strong>{resource.title}</strong>
                                      {resource.type === "link" && resource.url ? (
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="resourceLink"
                                        >
                                          {resource.url}
                                        </a>
                                      ) : (
                                        resource.content && (
                                          <p className="resourceContent">{resource.content}</p>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="helperText" style={{ marginLeft: "36px" }}>
                                No hay recursos en esta sección aún.
                              </p>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Section>
    </section>
  );
}
