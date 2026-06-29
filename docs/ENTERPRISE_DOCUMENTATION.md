# Documentacion Empresarial - Courses Platform

## 1. Resumen Ejecutivo

`Courses Platform` es una aplicacion academica modular para gestionar cursos,
docentes y estudiantes. Esta construida como monorepo para facilitar el trabajo
de una fabrica de software: separa aplicaciones, centraliza contratos y mantiene
documentacion tecnica junto al codigo.

El producto actual cubre:

- Registro y consulta de estudiantes.
- Registro y consulta de docentes.
- Registro y consulta de cursos.
- Vistas individuales por entidad.
- API REST documentada con Swagger/OpenAPI.

## 2. Objetivos del Sistema

- Proveer una base academica extensible para gestion de cursos.
- Mantener separacion clara entre frontend, backend y contratos compartidos.
- Facilitar incorporacion de nuevos desarrolladores con estructura predecible.
- Habilitar documentacion API consumible por QA, integraciones y frontend.
- Preparar la arquitectura para persistencia, autenticacion y pruebas e2e.

## 3. Alcance Funcional

| Componente | Funcionalidad actual | Evolucion esperada |
| --- | --- | --- |
| Estudiantes | Crear, listar y consultar detalle | Matricula en cursos, historial academico |
| Docentes | Crear, listar y consultar detalle | Carga horaria, disponibilidad |
| Cursos | Crear, listar y consultar detalle | Cupos, inscripciones, estados |
| API | REST con Swagger | Versionado, autenticacion, paginacion |
| Frontend | Paginas por modulo y detalle | Busqueda, filtros avanzados, edicion |

## 4. Actores

| Actor | Necesidad |
| --- | --- |
| Administrador academico | Gestionar estudiantes, docentes y cursos. |
| Equipo frontend | Consumir contratos estables de la API. |
| Equipo backend | Evolucionar modulos de dominio y reglas de negocio. |
| QA | Validar endpoints, respuestas y flujos de usuario. |
| DevOps | Ejecutar, empaquetar y desplegar aplicaciones. |

## 5. Arquitectura de Alto Nivel

```text
apps/
  backend/       API REST NestJS
  frontend/      SPA React/Vite
packages/
  shared/        Tipos y contratos TypeScript reutilizables
docs/            Documentacion de arquitectura, componentes y backlog
```

El backend expone endpoints REST bajo `/api`. El frontend consume esos endpoints
desde `apps/frontend/src/services/api.ts`. Los tipos principales se comparten
desde `packages/shared`.

## 6. Componentes Clave

### Backend NestJS

Responsable de exponer la API, validar entradas y coordinar reglas de negocio.
La estructura por modulo permite que cada capacidad academica evolucione de
forma independiente.

Componentes:

- `controller`: contrato HTTP y decoradores Swagger.
- `service`: reglas de aplicacion y manejo de errores.
- `repository`: acceso a datos, actualmente en memoria.
- `dto`: modelos de entrada y salida para validacion y documentacion.

### Frontend React/Vite

Responsable de la experiencia de usuario. Implementa paginas por recurso:

- Dashboard principal.
- Pagina de cursos.
- Pagina de estudiantes.
- Pagina de docentes.
- Paginas de detalle por identificador.

### Shared Contracts

`packages/shared` contiene los tipos de dominio usados por frontend y backend.
Su objetivo es reducir diferencias entre capas durante el desarrollo.

### Swagger/OpenAPI

Swagger es el contrato API visible para integraciones, QA y pruebas manuales:

```text
http://localhost:3000/api/docs
```

## 7. Contratos API

| Recurso | Metodo | Endpoint | Descripcion |
| --- | --- | --- | --- |
| Estudiantes | GET | `/api/students` | Lista estudiantes. |
| Estudiantes | GET | `/api/students/{id}` | Consulta detalle de estudiante. |
| Estudiantes | POST | `/api/students` | Crea estudiante. |
| Docentes | GET | `/api/teachers` | Lista docentes. |
| Docentes | GET | `/api/teachers/{id}` | Consulta detalle de docente. |
| Docentes | POST | `/api/teachers` | Crea docente. |
| Cursos | GET | `/api/courses` | Lista cursos. |
| Cursos | GET | `/api/courses/{id}` | Consulta detalle de curso. |
| Cursos | POST | `/api/courses` | Crea curso. |

## 8. Reglas Tecnicas Actuales

- Todas las rutas backend usan prefijo `/api`.
- La API habilita CORS para `http://localhost:5173`.
- Las entradas se validan con `ValidationPipe`.
- Propiedades no permitidas se rechazan con `forbidNonWhitelisted`.
- Los registros inexistentes responden `404`.
- La persistencia actual es en memoria y se reinicia con el proceso.

## 9. Criterios de Calidad

| Dimension | Criterio |
| --- | --- |
| Mantenibilidad | Modulos por dominio y responsabilidades separadas. |
| Trazabilidad | Swagger documenta endpoints y modelos. |
| Extensibilidad | Repositorios reemplazables por base de datos. |
| Usabilidad | Paginas por recurso y vistas individuales. |
| Validacion | DTOs con `class-validator`. |
| Build | `npm run build` debe pasar en todos los workspaces. |

## 10. Riesgos y Deuda Tecnica

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Persistencia en memoria | Perdida de datos al reiniciar | Integrar PostgreSQL + ORM. |
| Sin autenticacion | Acceso abierto a operaciones | Implementar JWT/sesiones y roles. |
| Sin pruebas automatizadas reales | Regresiones no detectadas | Agregar unitarias y e2e. |
| Router manual en frontend | Puede crecer en complejidad | Migrar a React Router si aumentan paginas. |
| Sin paginacion | Listas grandes afectan UX/API | Agregar paginacion y busqueda. |

## 11. Guia de Operacion Local

Instalar dependencias:

```bash
npm install
```

Levantar backend:

```bash
npm run dev:backend
```

Levantar frontend:

```bash
npm run dev:frontend
```

Validar build:

```bash
npm run build
```

## 12. Roadmap Recomendado

1. Persistencia real con PostgreSQL.
2. Migraciones y seed de datos.
3. Edicion y eliminacion de recursos.
4. Matricula de estudiantes en cursos.
5. Autenticacion y autorizacion por roles.
6. Pruebas unitarias de servicios.
7. Pruebas e2e de API.
8. Pipeline CI/CD con build, lint y test.
9. Observabilidad: logs estructurados, metricas y healthcheck.
