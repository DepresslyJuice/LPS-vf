# Guía del Framework de Componentes Reutilizables

Esta guía explica la visión, estructura y convenciones del framework de
componentes reutilizables de la fábrica de software. Su objetivo es que
cualquier desarrollador —actual o futuro— pueda entender la intención del
proyecto y contribuir siguiendo los patrones establecidos.

---

## 1. Visión del Proyecto

Este monorepo implementa una **fábrica de software académica** donde:

- El código se organiza para **maximizar la reutilización** entre aplicaciones.
- Los **contratos de datos** (tipos TypeScript) se comparten entre frontend y backend.
- Los **componentes UI** viven en un paquete centralizado consumible por cualquier app.
- Los **módulos backend** siguen un patrón CRUD estandarizado, reproducible con generadores.
- Las **decisiones de diseño** están documentadas como design tokens y convenciones explícitas.

**Principio rector:** cada vez que un patrón se repite más de una vez, debe
convertirse en un componente reutilizable (UI), un template de generador
(backend), o un tipo compartido (shared).

---

## 2. Mapa del Monorepo

```text
├── apps/
│   ├── backend/         API REST NestJS
│   └── frontend/        SPA React/Vite
├── packages/
│   ├── shared/          Tipos y contratos TypeScript (@courses/shared)
│   └── ui/              Componentes React reutilizables (@courses/ui)
├── tools/
│   └── generators/      Templates para generadores de código (Plop)
├── docs/                Documentación de arquitectura y guías
├── plopfile.mjs         Configuración de generadores
└── package.json         Raíz del monorepo (npm workspaces)
```

### Relaciones entre paquetes

```text
@courses/frontend ──┬── @courses/shared (tipos)
                    └── @courses/ui     (componentes)

@courses/backend  ───── @courses/shared (tipos)
```

- `@courses/shared` no tiene dependencias.
- `@courses/ui` depende de React como peerDependency y no tiene dependencias a shared.
- Las apps dependen de los paquetes, nunca al revés.

---

## 3. Paquete `@courses/shared` — Contratos de Datos

### ¿Qué contiene?

Tipos e interfaces TypeScript que representan las entidades del dominio y sus
contratos de entrada/salida.

### Ubicación

```text
packages/shared/src/index.ts
```

### Convenciones

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Entidad | `interface {PascalCase}` | `Student`, `Course` |
| Input de creación | `type Create{Entity}Input = Omit<Entity, "id">` | `CreateStudentInput` |
| Input de actualización | `type Update{Entity}Input = Partial<Create{Entity}Input>` | `UpdateStudentInput` |
| Enums de estado | `type {Entity}{Field} = "a" \| "b"` | `CourseStatus` |
| ID genérico | `type EntityId = string` | Usado en todas las entidades |

### Cuándo agregar un tipo

- Cuando un tipo se usa **tanto en frontend como en backend**.
- Cuando defines una entidad nueva del dominio.
- Cuando un contrato de API necesita documentarse como tipo.

### Cómo agregar un tipo

1. Editar `packages/shared/src/index.ts`.
2. Exportar la nueva interface/type.
3. Ejecutar `npm run build -w @courses/shared` para compilar.
4. Importar desde `@courses/shared` en frontend o backend.

---

## 4. Paquete `@courses/ui` — Componentes React

### ¿Qué contiene?

Componentes React reutilizables con estilos aislados y design tokens CSS.

### Estructura

```text
packages/ui/
  src/
    tokens.css            ← Design tokens (variables CSS)
    index.ts              ← Barrel export
    components/
      Metric.tsx          ← Componente
      Metric.css          ← Estilos del componente
      Section.tsx
      Section.css
      StatusBadge.tsx
      StatusBadge.css
      DataTable.tsx
      DataTable.css
      FormField.tsx
      FormField.css
      EmptyState.tsx
      EmptyState.css
      Modal.tsx
      Modal.css
```

### Componentes disponibles

| Componente | Propósito | Props principales |
|-----------|-----------|-------------------|
| `Metric` | Tarjeta de indicador numérico | `label`, `value` |
| `Section` | Contenedor con título y acción | `title`, `action`, `children` |
| `StatusBadge` | Badge de estado coloreado | `status`, `label?` |
| `DataTable` | Tabla genérica con filas clickeables | `items`, `keyOf`, `primary`, `secondary?`, `action?`, `onRowClick?` |
| `FormField` | Input con label y error | `label`, `error?`, `as?` (input/textarea) |
| `EmptyState` | Indicador de contenido vacío | `icon?`, `title?`, `message`, `action?` |
| `Modal` | Dialog modal con overlay | `title`, `onClose`, `children`, `footer?` |

### Cómo usar componentes en una app

1. Agregar la dependencia en el `package.json` de tu app:

```json
{
  "dependencies": {
    "@courses/ui": "0.1.0"
  }
}
```

2. Importar los estilos en tu entry point (una sola vez):

```tsx
// main.tsx
import "@courses/ui/src/tokens.css";
import "@courses/ui/src/components/Metric.css";
// ... o importar todos los CSS necesarios
```

3. Importar y usar componentes:

```tsx
import { Metric, Section, DataTable } from "@courses/ui";

export function DashboardPage() {
  return (
    <Section title="Resumen">
      <Metric label="Usuarios" value={42} />
    </Section>
  );
}
```

### Cómo crear un componente nuevo

Seguir este checklist obligatorio:

- [ ] **Crear** `{ComponentName}.tsx` en `packages/ui/src/components/`.
- [ ] **Crear** `{ComponentName}.css` en la misma carpeta.
- [ ] **Exportar** props interface y componente desde el archivo.
- [ ] **Agregar** export en `packages/ui/src/index.ts`.
- [ ] **Usar** design tokens (`--ui-*`) en el CSS, no valores hardcodeados.
- [ ] **Documentar** con JSDoc: descripción, ejemplo de uso y descripción de props.
- [ ] **Prefijo CSS**: todas las clases deben comenzar con `ui{ComponentName}__`.
- [ ] **Compilar**: ejecutar `npm run build -w @courses/ui`.
- [ ] **Agregar** a esta tabla de componentes disponibles.

### Convenciones de estilo CSS

```css
/* ✅ Correcto — usa tokens y prefijo */
.uiMetric {
  border: var(--ui-border-width) solid var(--ui-color-border);
  border-radius: var(--ui-radius-lg);
  padding: var(--ui-space-xl);
}

/* ❌ Incorrecto — valores hardcodeados, sin prefijo */
.metric {
  border: 1px solid #dce5e0;
  border-radius: 8px;
  padding: 18px;
}
```

---

## 5. Design Tokens

Los design tokens viven en `packages/ui/src/tokens.css` como CSS custom
properties con el prefijo `--ui-`.

### Categorías

| Categoría | Prefijo | Ejemplo |
|-----------|---------|---------|
| Colores base | `--ui-color-` | `--ui-color-text`, `--ui-color-surface` |
| Colores primarios | `--ui-color-primary` | `--ui-color-primary`, `--ui-color-primary-hover` |
| Colores de estado | `--ui-color-{estado}` | `--ui-color-draft`, `--ui-color-published` |
| Tipografía | `--ui-font-` | `--ui-font-size-sm`, `--ui-font-weight-bold` |
| Espaciado | `--ui-space-` | `--ui-space-sm`, `--ui-space-lg` |
| Bordes | `--ui-radius-` | `--ui-radius-md`, `--ui-radius-lg` |
| Sombras | `--ui-shadow-` | `--ui-shadow-sm`, `--ui-shadow-overlay` |
| Transiciones | `--ui-transition-` | `--ui-transition-fast` |
| Z-Index | `--ui-z-` | `--ui-z-modal` |

### Personalización por app

Las apps pueden sobreescribir tokens en su propio `:root`:

```css
/* apps/frontend/src/styles.css */
:root {
  --ui-color-primary: #2563eb;  /* Cambiar color primario a azul */
}
```

---

## 6. Anatomía de un Módulo Backend

Cada módulo backend sigue esta estructura obligatoria:

```text
apps/backend/src/modules/{nombre}s/
  {nombre}s.module.ts        ← Registro NestJS
  {nombre}s.controller.ts    ← Contrato HTTP + Swagger
  {nombre}s.service.ts       ← Reglas de negocio
  {nombre}s.repository.ts    ← Acceso a datos (Supabase)
  dto/
    create-{nombre}.dto.ts   ← Validación de creación
    {nombre}-response.dto.ts ← Modelo de respuesta Swagger
    update-{nombre}.dto.ts   ← Validación de actualización
```

### Responsabilidades por capa

| Capa | Responsabilidad | No debe hacer |
|------|----------------|---------------|
| **Controller** | Recibir HTTP, validar entrada, devolver respuesta, documentar Swagger | Lógica de negocio, acceso a datos |
| **Service** | Orquestar reglas de negocio, lanzar excepciones de dominio | Acceso directo a Supabase, conocer HTTP |
| **Repository** | CRUD contra la base de datos, transformar resultados | Validación de negocio, lanzar HttpException |
| **DTO** | Validar forma de datos con decoradores | Lógica, acceso a datos |

### Convenciones del controlador

- Decorador `@ApiTags("{nombre}s")` para agrupar en Swagger.
- Decorador `@Controller("{nombre}s")` como ruta REST.
- Cada endpoint tiene `@ApiOperation`, `@ApiResponse` y `@ApiParam` cuando aplica.
- Usar `@HttpCode(204)` para DELETE.

### Convenciones del servicio

- Lanzar `NotFoundException` cuando un registro no existe.
- Delegar todo acceso a datos al repository.
- Los métodos son `async` y retornan Promises.

### Convenciones del repository

- Inyectar `SupabaseService` vía constructor.
- Cada método maneja el patrón `{ data, error }` de Supabase.
- `findById` retorna `undefined` en vez de lanzar error (el service decide).

### Registro del módulo

Después de generar un módulo, registrarlo manualmente en `app.module.ts`:

```typescript
// apps/backend/src/app.module.ts
import { NewModule } from "./modules/new/new.module";

@Module({
  imports: [DatabaseModule, StudentsModule, TeachersModule, CoursesModule, NewModule],
})
export class AppModule {}
```

---

## 7. Generadores de Código

### ¿Qué son?

Scripts que generan archivos a partir de templates, siguiendo los patrones
establecidos del proyecto. Esto evita errores humanos y acelera la creación de
módulos nuevos.

### Herramienta

Usamos **Plop.js** (https://plopjs.com). La configuración está en `plopfile.mjs`
y los templates en `tools/generators/`.

### Generadores disponibles

| Generador | Comando | Qué genera |
|-----------|---------|-----------|
| `module` | `npm run generate:module` | 7 archivos: module, controller, service, repository, 3 DTOs |

### Cómo usar el generador de módulos

```bash
npm run generate:module
```

El generador pregunta:
1. **Nombre de la entidad** (singular, minúsculas): ej. `enrollment`

Y genera:
```text
apps/backend/src/modules/enrollments/
  enrollments.module.ts
  enrollments.controller.ts
  enrollments.service.ts
  enrollments.repository.ts
  dto/
    create-enrollment.dto.ts
    enrollment-response.dto.ts
    update-enrollment.dto.ts
```

### Pasos después de generar

1. **Personalizar DTOs**: agregar los campos específicos de la entidad.
2. **Agregar tipo a shared**: crear la interface en `packages/shared/src/index.ts`.
3. **Tipar service y repository**: reemplazar `Record<string, unknown>` con el tipo de shared.
4. **Registrar módulo**: importar en `apps/backend/src/app.module.ts`.
5. **Crear migración**: agregar tabla en Supabase si es necesario.

### Cómo crear un generador nuevo

1. Crear carpeta `tools/generators/{nombre}/` con templates `.hbs`.
2. Agregar `plop.setGenerator("{nombre}", { ... })` en `plopfile.mjs`.
3. Agregar script en `package.json`: `"generate:{nombre}": "plop {nombre}"`.
4. Documentar en esta guía.

### Helpers disponibles en templates

Plop incluye estos helpers de texto automáticamente:

| Helper | Entrada | Salida |
|--------|---------|--------|
| `{{camelCase name}}` | `enrollment` | `enrollment` |
| `{{pascalCase name}}` | `enrollment` | `Enrollment` |
| `{{snakeCase name}}` | `enrollment` | `enrollment` |
| `{{kebabCase name}}` | `enrollment` | `enrollment` |
| `{{titleCase name}}` | `enrollment` | `Enrollment` |

---

## 8. Flujo de Trabajo para Funcionalidades Nuevas

Cuando se necesita agregar una nueva capacidad al sistema:

### Paso 1 — Definir el contrato

Agregar tipos en `packages/shared/src/index.ts`:

```typescript
export interface Enrollment {
  id: EntityId;
  studentId: EntityId;
  courseId: EntityId;
  enrolledAt: string;
}

export type CreateEnrollmentInput = Omit<Enrollment, "id">;
export type UpdateEnrollmentInput = Partial<CreateEnrollmentInput>;
```

### Paso 2 — Generar el módulo backend

```bash
npm run generate:module
# Nombre: enrollment
```

Personalizar los archivos generados con los campos de la entidad.

### Paso 3 — Registrar el módulo

Editar `apps/backend/src/app.module.ts` y agregar el import.

### Paso 4 — Crear migración de base de datos

```bash
npm run db:migration:new create_enrollments_table
```

### Paso 5 — Agregar funciones al servicio API del frontend

Editar `apps/frontend/src/services/api.ts`:

```typescript
getEnrollments: () => request<Enrollment[]>("/enrollments"),
createEnrollment: (input: CreateEnrollmentInput) =>
  request<Enrollment>("/enrollments", {
    method: "POST",
    body: JSON.stringify(input),
  }),
```

### Paso 6 — Crear página frontend

Usar componentes de `@courses/ui` para construir la página:

```tsx
import { Section, DataTable, EmptyState } from "@courses/ui";

export function EnrollmentsPage({ enrollments }) {
  if (enrollments.length === 0) {
    return <EmptyState icon="📋" message="No hay matrículas." />;
  }

  return (
    <Section title="Matrículas">
      <DataTable
        items={enrollments}
        keyOf={(e) => e.id}
        primary={(e) => e.studentId}
        secondary={(e) => e.courseId}
      />
    </Section>
  );
}
```

---

## 9. Decisiones Arquitectónicas (ADR)

| # | Decisión | Justificación |
|---|----------|---------------|
| 1 | Monorepo con npm workspaces | Simplifica versionamiento local y permite compartir código sin publicar a npm. |
| 2 | Paquete `@courses/shared` para tipos | Evita divergencias entre frontend y backend al compartir interfaces. |
| 3 | Paquete `@courses/ui` para componentes | Centraliza UI reutilizable; cualquier app nueva consume los mismos componentes. |
| 4 | Design tokens como CSS custom properties | Permiten tematización sin cambiar componentes; las apps sobreescriben `:root`. |
| 5 | Prefijo `ui` en clases CSS | Evita colisiones con estilos de las apps consumidoras. |
| 6 | Plop.js para generadores | Micro-generador simple, sin dependencias pesadas, ideal para monorepos. |
| 7 | Templates basados en módulos existentes | Los templates replican exactamente los patrones de students/teachers/courses. |
| 8 | Repository pattern en backend | Aísla el acceso a datos; permite reemplazar Supabase sin tocar servicios. |
| 9 | DTOs con class-validator | Validación declarativa integrada con NestJS y documentada en Swagger. |
| 10 | React sin framework de estado | Mantiene dependencias mínimas; los hooks y lifting state son suficientes actualmente. |

---

## 10. Cuándo extender el framework

| Señal | Acción recomendada |
|-------|-------------------|
| Un componente UI se copia entre páginas | Moverlo a `packages/ui` |
| Se crea un módulo backend nuevo manualmente | Crear/usar un generador |
| Un tipo se define en frontend Y backend | Moverlo a `packages/shared` |
| Un color o tamaño se repite en el CSS | Extraerlo como design token |
| El equipo crece a 4+ personas | Considerar Storybook para documentación visual |
| Se necesitan variantes del producto | Evaluar feature flags y configuración por producto |

---

## 11. Referencias

- [README.md](../README.md) — Visión general y ejecución.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitectura técnica.
- [COMPONENTS.md](./COMPONENTS.md) — Catálogo de componentes por capa.
- [API_CONTRACT.md](./API_CONTRACT.md) — Contrato REST y ejemplos.
- [OPERATIONS_AND_QUALITY.md](./OPERATIONS_AND_QUALITY.md) — Operación y calidad.
- [Plop.js docs](https://plopjs.com/documentation) — Documentación del generador.
