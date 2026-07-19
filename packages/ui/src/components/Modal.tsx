import { type ReactNode, useEffect } from "react";

/**
 * Modal — dialog modal con overlay.
 *
 * Renderiza un panel centrado sobre un fondo oscuro. Se cierra
 * con el botón ✕, haciendo click en el backdrop, o presionando Escape.
 * Incluye slots para header (título), body y footer.
 *
 * @example
 * ```tsx
 * {showModal && (
 *   <Modal title="Confirmar acción" onClose={() => setShowModal(false)}>
 *     <p>¿Estás seguro de eliminar este registro?</p>
 *     <Modal.Footer>
 *       <button onClick={handleDelete}>Eliminar</button>
 *     </Modal.Footer>
 *   </Modal>
 * )}
 * ```
 */

export interface ModalProps {
  /** Título visible en la cabecera del modal. */
  title: string;
  /** Callback al cerrar el modal (botón ✕, Escape o click en backdrop). */
  onClose: () => void;
  /** Contenido principal del modal. */
  children: ReactNode;
  /** Contenido del footer (botones de acción). */
  footer?: ReactNode;
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="uiModal__backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="uiModal__panel">
        <div className="uiModal__header">
          <h2 className="uiModal__title">{title}</h2>
          <button
            className="uiModal__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="uiModal__body">{children}</div>
        {footer ? <div className="uiModal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
