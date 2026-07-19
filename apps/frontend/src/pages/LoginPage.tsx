import React, { useState } from "react";
import { useAuth } from "../hooks/AuthProvider";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      // App.tsx auth guard will automatically redirect on success
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            border: "none",
            padding: "30px",
          }}
        >
          <div style={{ textAlign: "center", paddingBottom: "10px" }}>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                LPS
              </div>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", margin: "0 0 8px 0" }}>
              Bienvenido de vuelta
            </h2>
            <p style={{ color: "#666", margin: "0 0 20px 0" }}>
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {error && (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#444" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tutor@sistema.com"
                  required
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#444" }}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "10px",
                  transition: "transform 0.2s, boxShadow 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!loading) (e.currentTarget.style.transform = "translateY(-2px)");
                }}
                onMouseOut={(e) => {
                  if (!loading) (e.currentTarget.style.transform = "translateY(0)");
                }}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
