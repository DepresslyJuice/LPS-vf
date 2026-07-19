import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * FormField — input con label, placeholder y mensaje de error.
 *
 * Envuelve un `<input>` o `<textarea>` con una etiqueta visible
 * y un mensaje de error opcional. Se integra con formularios HTML nativos.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Nombre"
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 *   required
 *   error={errors.name}
 * />
 *
 * <FormField
 *   label="Descripción"
 *   as="textarea"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 * />
 * ```
 */

type BaseInputProps = InputHTMLAttributes<HTMLInputElement>;
type BaseTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export type FormFieldProps = {
  /** Texto de la etiqueta visible. */
  label: string;
  /** Mensaje de error. Si está presente, el campo se resalta en rojo. */
  error?: string;
} & (
  | ({ as?: "input" } & BaseInputProps)
  | ({ as: "textarea" } & BaseTextareaProps)
);

export function FormField(props: FormFieldProps) {
  const { label, error, as = "input", ...rest } = props;

  const inputClass = [
    "uiFormField__input",
    as === "textarea" ? "uiFormField__textarea" : "",
    error ? "uiFormField__input--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="uiFormField">
      <label className="uiFormField__label">{label}</label>
      {as === "textarea" ? (
        <textarea
          className={inputClass}
          {...(rest as BaseTextareaProps)}
        />
      ) : (
        <input
          className={inputClass}
          {...(rest as BaseInputProps)}
        />
      )}
      {error ? <span className="uiFormField__error">{error}</span> : null}
    </div>
  );
}
