# Arquitectura de Fabrica de Software

## Principios

- Separacion por aplicaciones: backend y frontend evolucionan de forma independiente.
- Contratos compartidos: las interfaces del dominio viven en `packages/shared`.
- Modulos por capacidad de negocio: estudiantes, docentes y cursos.
- Infraestructura reemplazable: los repositorios en memoria pueden sustituirse por persistencia real sin cambiar controladores.
- Convenciones explicitas: scripts, README, CI y backlog para que el equipo trabaje con el mismo mapa.

## Backend

El backend usa NestJS con una organizacion modular:

```text
src/
  common/
  modules/
    students/
    teachers/
    courses/
```

Cada modulo contiene:

- `*.controller.ts`: contrato HTTP.
- `*.service.ts`: reglas de aplicacion.
- `*.repository.ts`: acceso a datos.
- `dto/`: entrada/salida HTTP.

## Frontend

El frontend usa React con Vite:

```text
src/
  components/
  pages/
  services/
```

La UI inicial consume la API y muestra paneles para estudiantes, docentes y cursos.

## Siguiente evolucion sugerida

1. Agregar base de datos PostgreSQL.
2. Integrar ORM.
3. Agregar autenticacion y roles.
4. Crear pruebas unitarias y e2e.
5. Definir pipeline de despliegue.
