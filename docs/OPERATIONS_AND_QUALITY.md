# Operacion y Calidad

## Comandos Principales

Instalar dependencias:

```bash
npm install
```

Backend en desarrollo:

```bash
npm run dev:backend
```

Frontend en desarrollo:

```bash
npm run dev:frontend
```

Build completo:

```bash
npm run build
```

Lint TypeScript:

```bash
npm run lint
```

## URLs Locales

| Servicio | URL |
| --- | --- |
| Backend API | `http://localhost:3000/api` |
| Swagger | `http://localhost:3000/api/docs` |
| Swagger JSON | `http://localhost:3000/api/docs-json` |
| Frontend | `http://localhost:5173` |

## Checklist de Entrega

Antes de entregar una version:

- `npm run build` pasa correctamente.
- Swagger refleja endpoints nuevos o modificados.
- DTOs tienen validaciones y ejemplos.
- Frontend maneja carga, error y exito.
- README o docs se actualizan si cambia el flujo.
- No se mezclan refactors no relacionados con la tarea.

## Estrategia de Pruebas Recomendada

| Nivel | Objetivo | Herramienta sugerida |
| --- | --- | --- |
| Unitarias backend | Servicios y reglas de negocio | Jest + Nest Testing |
| Integracion API | Controladores y validacion | Supertest |
| Frontend | Componentes y formularios | Testing Library |
| E2E | Flujos principales | Playwright |
| Contrato | Compatibilidad API | OpenAPI validation |

## Observabilidad Recomendada

Para ambientes reales se recomienda incorporar:

- Healthcheck `/api/health`.
- Logs estructurados con request id.
- Metricas de latencia y errores.
- Trazabilidad de operaciones de escritura.
- Alertas sobre errores 5xx y degradacion de latencia.

## Seguridad Recomendada

El prototipo actual no implementa autenticacion. Para uso empresarial:

- Autenticacion con JWT, sesiones o proveedor corporativo.
- Roles: administrador, coordinador academico, consulta.
- Proteccion CSRF si se usan cookies.
- Rate limiting para endpoints publicos.
- Validacion estricta de CORS por ambiente.
- Auditoria de operaciones sensibles.
