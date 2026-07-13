interface AppNavProps {
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
}

export function AppNav({ isActive, navigate }: AppNavProps) {
  return (
    <nav className="pageNav" aria-label="Paginas principales">
      <button
        className={`tabButton ${isActive("/") ? "isActive" : ""}`}
        onClick={() => navigate("/")}
        type="button"
      >
        Inicio
      </button>
      <button
        className={`tabButton ${isActive("/courses") ? "isActive" : ""}`}
        onClick={() => navigate("/courses")}
        type="button"
      >
        Cursos
      </button>
      <button
        className={`tabButton ${isActive("/students") ? "isActive" : ""}`}
        onClick={() => navigate("/students")}
        type="button"
      >
        Estudiantes
      </button>
      <button
        className={`tabButton ${isActive("/teachers") ? "isActive" : ""}`}
        onClick={() => navigate("/teachers")}
        type="button"
      >
        Docentes
      </button>
    </nav>
  );
}
