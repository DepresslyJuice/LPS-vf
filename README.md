# Courses Platform

Repositorio local con arquitectura de fabrica de software para una aplicacion de cursos.

## Stack

- Backend: NestJS + TypeScript
- Frontend: React + Vite + TypeScript
- Monorepo: npm workspaces
- Contratos compartidos: `packages/shared`
- Componentes UI reutilizables: `packages/ui`
- Generadores de código: Plop.js

## Estructura

```text
apps/
  backend/     API REST NestJS
  frontend/    SPA React/Vite
packages/
  shared/      Tipos y contratos reutilizables
  ui/          Componentes React reutilizables
tools/
  generators/  Templates para generadores de código
docs/          Arquitectura, convenciones y backlog
```

## Documentacion

- `docs/REUSABLE_FRAMEWORK_GUIDE.md`: guia del framework de componentes reutilizables.
- `docs/ENTERPRISE_DOCUMENTATION.md`: documentacion empresarial del sistema.
- `docs/ARCHITECTURE.md`: arquitectura y decisiones tecnicas.
- `docs/COMPONENTS.md`: componentes clave por capa.
- `docs/API_CONTRACT.md`: contrato REST y ejemplos.
- `docs/OPERATIONS_AND_QUALITY.md`: operacion, calidad y checklist.
- `docs/BACKLOG.md`: backlog funcional y tecnico.

## Ejecucion

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

Backend: `http://localhost:3000/api`

Frontend: `http://localhost:5173`

## Generadores

```bash
npm run generate:module    # Genera un modulo CRUD backend completo
```

Ver `docs/REUSABLE_FRAMEWORK_GUIDE.md` para detalles.

## Dominio inicial

- Estudiantes
- Docentes
- Cursos

La primera version usa repositorios en memoria para acelerar el desarrollo. La capa de infraestructura queda aislada para reemplazarla luego por PostgreSQL, Prisma, TypeORM u otro adaptador.

