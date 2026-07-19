import type { ReactNode } from "react";

/**
 * Section — contenedor reutilizable para bloques de pantalla.
 *
 * Proporciona una tarjeta con título, acción opcional y slot de contenido.
 * Es el bloque de construcción principal para organizar páginas.
 *
 * @example
 * ```tsx
 * <Section title="Estudiantes" action={<button>Crear</button>}>
 *   <p>Contenido aquí</p>
 * </Section>
 * ```
 */

export interface SectionProps {
  /** Título visible en la cabecera de la sección. */
  title: string;
  /** Elemento opcional alineado a la derecha del título (botón, badge, etc.). */
  action?: ReactNode;
  /** Contenido principal de la sección. */
  children: ReactNode;
}

export function Section({ title, action, children }: SectionProps) {
  return (
    <section className="uiSection">
      <div className="uiSection__header">
        <h2 className="uiSection__title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
