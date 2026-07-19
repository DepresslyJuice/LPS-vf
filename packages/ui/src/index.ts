/**
 * @courses/ui — Librería de componentes React reutilizables.
 *
 * Este paquete concentra los componentes UI que cualquier aplicación
 * del monorepo puede consumir. Todos los componentes usan design tokens
 * definidos en `tokens.css`.
 *
 * ## Uso
 *
 * 1. Importar los estilos en el entry point de tu app:
 *
 *    ```ts
 *    import "@courses/ui/dist/tokens.css";
 *    ```
 *
 * 2. Importar componentes donde los necesites:
 *
 *    ```ts
 *    import { Metric, Section, DataTable } from "@courses/ui";
 *    ```
 *
 * ## Componentes disponibles
 *
 * - `Metric`      — Tarjeta de indicador numérico.
 * - `Section`     — Contenedor con título y acción opcional.
 * - `StatusBadge` — Indicador visual de estado (draft/published/archived).
 * - `DataTable`   — Tabla genérica con filas clickeables.
 * - `FormField`   — Input con label, validación y error.
 * - `EmptyState`  — Indicador de contenido vacío.
 * - `Modal`       — Dialog modal con overlay.
 */

// ── Componentes ──
export { Metric } from "./components/Metric";
export type { MetricProps } from "./components/Metric";

export { Section } from "./components/Section";
export type { SectionProps } from "./components/Section";

export { StatusBadge } from "./components/StatusBadge";
export type { StatusBadgeProps } from "./components/StatusBadge";

export { DataTable } from "./components/DataTable";
export type { DataTableProps } from "./components/DataTable";

export { FormField } from "./components/FormField";
export type { FormFieldProps } from "./components/FormField";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
