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
