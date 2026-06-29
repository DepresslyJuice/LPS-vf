# Componentes Clave

## Backend

### `AppModule`

Ubicacion: `apps/backend/src/app.module.ts`

Modulo raiz de NestJS. Importa las capacidades de negocio disponibles:

- `StudentsModule`
- `TeachersModule`
- `CoursesModule`

### `main.ts`

Ubicacion: `apps/backend/src/main.ts`

Responsabilidades:

- Crear la aplicacion NestJS.
- Configurar prefijo global `/api`.
- Configurar CORS para el frontend local.
- Activar validacion global.
- Registrar Swagger en `/api/docs`.

### Modulo Students

Ubicacion: `apps/backend/src/modules/students`

Responsabilidades:

- Crear estudiantes.
- Listar estudiantes.
- Consultar estudiante por id.

Archivos principales:

- `students.controller.ts`
- `students.service.ts`
- `students.repository.ts`
- `dto/create-student.dto.ts`
- `dto/student-response.dto.ts`

### Modulo Teachers

Ubicacion: `apps/backend/src/modules/teachers`

Responsabilidades:

- Crear docentes.
- Listar docentes.
- Consultar docente por id.

Archivos principales:

- `teachers.controller.ts`
- `teachers.service.ts`
- `teachers.repository.ts`
- `dto/create-teacher.dto.ts`
- `dto/teacher-response.dto.ts`

### Modulo Courses

Ubicacion: `apps/backend/src/modules/courses`

Responsabilidades:

- Crear cursos.
- Listar cursos.
- Consultar curso por id.
- Asociar curso a docente mediante `teacherId`.

Archivos principales:

- `courses.controller.ts`
- `courses.service.ts`
- `courses.repository.ts`
- `dto/create-course.dto.ts`
- `dto/course-response.dto.ts`

## Frontend

### `App`

Ubicacion: `apps/frontend/src/pages/App.tsx`

Responsabilidades:

- Cargar datos iniciales.
- Administrar rutas de pagina con History API.
- Renderizar dashboard, listados y detalles.
- Crear estudiantes, docentes y cursos.
- Consumir el servicio HTTP centralizado.

Paginas:

- `/`
- `/courses`
- `/students`
- `/teachers`
- `/courses/:id`
- `/students/:id`
- `/teachers/:id`

### `api`

Ubicacion: `apps/frontend/src/services/api.ts`

Responsabilidades:

- Centralizar URL base de API.
- Ejecutar requests HTTP.
- Exponer funciones por recurso.

Funciones:

- `getStudents`
- `getStudent`
- `createStudent`
- `getTeachers`
- `getTeacher`
- `createTeacher`
- `getCourses`
- `getCourse`
- `createCourse`

### Componentes UI

Ubicacion: `apps/frontend/src/components`

- `Metric`: tarjeta de indicador numerico.
- `Section`: contenedor reutilizable para bloques de pantalla.

## Shared

Ubicacion: `packages/shared/src/index.ts`

Contratos:

- `EntityId`
- `Student`
- `Teacher`
- `Course`
- `CreateStudentInput`
- `CreateTeacherInput`
- `CreateCourseInput`

Estos tipos ayudan a mantener consistencia entre frontend y backend.
