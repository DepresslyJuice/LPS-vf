import type { LoadState } from "../types/ui";
import { useAuth } from "../hooks/AuthProvider";

interface AppHeaderProps {
  loadState: LoadState;
}

export function AppHeader({ loadState }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Fabrica de software academica</p>
        <h1>Courses Platform</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span className={`status status-${loadState}`}>{loadState}</span>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px", paddingLeft: "16px", borderLeft: "1px solid #ccc" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>{user.nombre}</div>
              <div style={{ fontSize: "12px", color: "#666", textTransform: "capitalize" }}>{user.roles.join(', ')}</div>
            </div>
            <button 
              onClick={logout} 
              style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", color: "#374151" }}
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

