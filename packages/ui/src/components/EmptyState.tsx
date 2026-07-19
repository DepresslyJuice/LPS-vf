import type { ReactNode } from "react";

/**
 * EmptyState — indicador de contenido vacío.
 *
 * Muestra un mensaje cuando una lista o sección no tiene datos.
 * Opcionalmente incluye un ícono (emoji o componente), un título,
 * un mensaje descriptivo y una acción (botón).
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📚"
 *   title="Sin cursos"
 *   message="Crea tu primer curso para comenzar."
 *   action={<button onClick={onCreate}>Crear curso</button>}
 * />
 * ```
 */

export interface EmptyStateProps {
  /** Ícono o emoji que se muestra arriba del título. */
  icon?: ReactNode;
  /** Título destacado. */
  title?: string;
  /** Mensaje descriptivo. */
  message: string;
  /** Acción opcional (botón, link, etc.). */
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="uiEmptyState">
      {icon ? <div className="uiEmptyState__icon">{icon}</div> : null}
      {title ? <h3 className="uiEmptyState__title">{title}</h3> : null}
      <p className="uiEmptyState__message">{message}</p>
      {action ?? null}
    </div>
  );
}
