# Contrato API

## Base URL

```text
http://localhost:3000/api
```

## Swagger

UI interactiva:

```text
http://localhost:3000/api/docs
```

Documento OpenAPI:

```text
http://localhost:3000/api/docs-json
```

## Estudiantes

### Listar estudiantes

```http
GET /api/students
```

Respuesta `200`:

```json
[
  {
    "id": "student_ana",
    "name": "Ana Torres",
    "email": "ana.torres@example.com",
    "enrolledCourseIds": ["course_react"]
  }
]
```

### Obtener estudiante

```http
GET /api/students/{id}
```

Respuestas:

- `200`: estudiante encontrado.
- `404`: estudiante no encontrado.

### Crear estudiante

```http
POST /api/students
```

Body:

```json
{
  "name": "Ana Torres",
  "email": "ana.torres@example.com"
}
```

Respuestas:

- `201`: estudiante creado.
- `400`: datos invalidos.

## Docentes

### Listar docentes

```http
GET /api/teachers
```

### Obtener docente

```http
GET /api/teachers/{id}
```

Respuestas:

- `200`: docente encontrado.
- `404`: docente no encontrado.

### Crear docente

```http
POST /api/teachers
```

Body:

```json
{
  "name": "Carlos Mendoza",
  "email": "carlos.mendoza@example.com",
  "specialty": "Backend development"
}
```

Respuestas:

- `201`: docente creado.
- `400`: datos invalidos.

## Cursos

### Listar cursos

```http
GET /api/courses
```

### Obtener curso

```http
GET /api/courses/{id}
```

Respuestas:

- `200`: curso encontrado.
- `404`: curso no encontrado.

### Crear curso

```http
POST /api/courses
```

Body:

```json
{
  "title": "NestJS Fundamentals",
  "description": "Aprende a crear APIs robustas con NestJS y TypeScript.",
  "teacherId": "teacher_luis",
  "capacity": 30
}
```

Respuestas:

- `201`: curso creado.
- `400`: datos invalidos.

## Convenciones de Error

El backend utiliza excepciones HTTP de NestJS. Para recursos inexistentes se
devuelve `404`. Para validaciones de DTO se devuelve `400`.

## Recomendaciones para Integraciones

- Consumir Swagger como fuente de verdad del contrato HTTP.
- No depender de datos semilla para ambientes productivos.
- Considerar `id` como opaco; no inferir reglas de negocio desde su formato.
- Manejar `400` y `404` explicitamente en clientes.
