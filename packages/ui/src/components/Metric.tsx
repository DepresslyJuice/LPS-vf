/**
 * Metric — tarjeta de indicador numérico.
 *
 * Muestra un valor destacado con su etiqueta descriptiva.
 * Ideal para dashboards y resúmenes ejecutivos.
 *
 * @example
 * ```tsx
 * <Metric label="Estudiantes" value={42} />
 * ```
 */

export interface MetricProps {
  /** Texto descriptivo que aparece encima del valor. */
  label: string;
  /** Valor numérico destacado. */
  value: number;
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="uiMetric">
      <span className="uiMetric__label">{label}</span>
      <strong className="uiMetric__value">{value}</strong>
    </div>
  );
}
