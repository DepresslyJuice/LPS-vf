interface AppNavProps {
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  userRoles?: string[];
}

export function AppNav({ isActive, navigate, userRoles = [] }: AppNavProps) {
  const isStudent = userRoles.includes("estudiante")
    && !userRoles.includes("admin")
    && !userRoles.includes("tutor");
  const isTutor = userRoles.includes("tutor") && !userRoles.includes("admin");
  const canSeeTeachers = !isStudent && !isTutor;

  return (
    <nav className="pageNav" aria-label="Paginas principales">
      {!isStudent && (
        <button
          className={`tabButton ${isActive("/") ? "isActive" : ""}`}
          onClick={() => navigate("/")}
          type="button"
        >
          Inicio
        </button>
      )}
      <button
        className={`tabButton ${isActive("/courses") ? "isActive" : ""}`}
        onClick={() => navigate("/courses")}
        type="button"
      >
        {isStudent ? "Mis Cursos" : "Cursos"}
      </button>
      {!isStudent && (
        <button
          className={`tabButton ${isActive("/students") ? "isActive" : ""}`}
          onClick={() => navigate("/students")}
          type="button"
        >
          Estudiantes
        </button>
      )}
      {canSeeTeachers && (
        <button
          className={`tabButton ${isActive("/teachers") ? "isActive" : ""}`}
          onClick={() => navigate("/teachers")}
          type="button"
        >
          Docentes
        </button>
      )}
    </nav>
  );
}
