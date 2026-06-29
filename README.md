# Courses Platform

Repositorio local con arquitectura de fabrica de software para una aplicacion de cursos.

## Stack

- Backend: NestJS + TypeScript
- Frontend: React + Vite + TypeScript
- Monorepo: npm workspaces
- Contratos compartidos: `packages/shared`

## Estructura

```text
apps/
  backend/     API REST NestJS
  frontend/    SPA React/Vite
packages/
  shared/      Tipos y contratos reutilizables
docs/          Arquitectura, convenciones y backlog
```

## Documentacion

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

## Dominio inicial

- Estudiantes
- Docentes
- Cursos

La primera version usa repositorios en memoria para acelerar el desarrollo. La capa de infraestructura queda aislada para reemplazarla luego por PostgreSQL, Prisma, TypeORM u otro adaptador.
