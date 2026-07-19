/**
 * StatusBadge — indicador visual de estado.
 *
 * Muestra un badge coloreado según el estado de una entidad.
 * Soporta los estados del dominio: draft, published, archived.
 * Se puede extender con variantes custom pasando un string arbitrario.
 *
 * @example
 * ```tsx
 * <StatusBadge status="published" />
 * <StatusBadge status="draft" label="Borrador" />
 * ```
 */

export interface StatusBadgeProps {
  /** Estado que determina el color del badge. */
  status: string;
  /** Texto visible. Si no se provee, se muestra el valor de `status`. */
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variant = `uiStatusBadge--${status}`;

  return (
    <span className={`uiStatusBadge ${variant}`}>
      {label ?? status}
    </span>
  );
}
