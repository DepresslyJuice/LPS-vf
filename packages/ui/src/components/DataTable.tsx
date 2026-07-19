import type { ReactNode } from "react";

/**
 * DataTable — tabla genérica con filas clickeables.
 *
 * Renderiza una lista de registros en formato tabla. Cada fila muestra
 * un texto principal, uno secundario opcional y una acción opcional.
 * Soporta click en la fila y un estado vacío configurable.
 *
 * @example
 * ```tsx
 * <DataTable
 *   items={students}
 *   keyOf={(s) => s.id}
 *   primary={(s) => s.name}
 *   secondary={(s) => s.email}
 *   onRowClick={(s) => navigate(`/students/${s.id}`)}
 *   emptyMessage="No hay estudiantes registrados."
 * />
 * ```
 */

export interface DataTableProps<T> {
  /** Lista de elementos a mostrar. */
  items: T[];
  /** Función que retorna una key única por elemento. */
  keyOf: (item: T) => string;
  /** Texto principal de cada fila. */
  primary: (item: T) => ReactNode;
  /** Texto secundario de cada fila (opcional). */
  secondary?: (item: T) => ReactNode;
  /** Acción derecha de cada fila — botón, badge, etc. (opcional). */
  action?: (item: T) => ReactNode;
  /** Callback al hacer click en una fila (opcional). */
  onRowClick?: (item: T) => void;
  /** Mensaje cuando la lista está vacía. */
  emptyMessage?: string;
}

export function DataTable<T>({
  items,
  keyOf,
  primary,
  secondary,
  action,
  onRowClick,
  emptyMessage = "No hay registros.",
}: DataTableProps<T>) {
  if (items.length === 0) {
    return <div className="uiDataTable__empty">{emptyMessage}</div>;
  }

  return (
    <div className="uiDataTable">
      {items.map((item) => {
        const clickable = onRowClick != null;
        const rowClass = `uiDataTable__row${clickable ? " uiDataTable__row--clickable" : ""}`;

        return (
          <div
            className={rowClass}
            key={keyOf(item)}
            onClick={clickable ? () => onRowClick(item) : undefined}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }
                : undefined
            }
          >
            <div className="uiDataTable__cell">
              <span className="uiDataTable__primary">{primary(item)}</span>
              {secondary ? (
                <span className="uiDataTable__secondary">
                  {secondary(item)}
                </span>
              ) : null}
            </div>
            {action ? action(item) : null}
          </div>
        );
      })}
    </div>
  );
}
