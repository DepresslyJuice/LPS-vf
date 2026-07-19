/**
 * Plopfile — Generadores de código para la fábrica de software.
 *
 * Uso:
 *   npm run generate:module   → Genera un módulo CRUD backend completo.
 *
 * Los templates viven en tools/generators/module/ y siguen los patrones
 * establecidos en los módulos existentes (students, teachers, courses).
 *
 * Para agregar nuevos generadores, añadir otro bloque plop.setGenerator().
 * Documentación de Plop: https://plopjs.com/documentation
 */

export default function (plop) {
  // ── Helpers de texto ──
  plop.setHelper("eq", (a, b) => a === b);

  // ── Generador: módulo backend CRUD ──
  plop.setGenerator("module", {
    description: "Genera un módulo CRUD completo en el backend NestJS",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre de la entidad (singular, minúsculas, ej: enrollment):",
        validate: (value) => {
          if (/^[a-z][a-z0-9]*$/.test(value)) return true;
          return "Usa solo letras minúsculas y números, empezando por letra.";
        },
      },
    ],
    actions: [
      // ── NestJS Module ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/{{name}}s.module.ts",
        templateFile: "tools/generators/module/module.ts.hbs",
      },
      // ── Controller ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/{{name}}s.controller.ts",
        templateFile: "tools/generators/module/controller.ts.hbs",
      },
      // ── Service ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/{{name}}s.service.ts",
        templateFile: "tools/generators/module/service.ts.hbs",
      },
      // ── Repository ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/{{name}}s.repository.ts",
        templateFile: "tools/generators/module/repository.ts.hbs",
      },
      // ── Create DTO ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/dto/create-{{name}}.dto.ts",
        templateFile: "tools/generators/module/create-dto.ts.hbs",
      },
      // ── Response DTO ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/dto/{{name}}-response.dto.ts",
        templateFile: "tools/generators/module/response-dto.ts.hbs",
      },
      // ── Update DTO ──
      {
        type: "add",
        path: "apps/backend/src/modules/{{name}}s/dto/update-{{name}}.dto.ts",
        templateFile: "tools/generators/module/update-dto.ts.hbs",
      },
    ],
  });
}
