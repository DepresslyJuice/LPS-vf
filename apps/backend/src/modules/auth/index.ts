/**
 * @module CoreAsset/Auth
 *
 * Punto de entrada único del módulo de autenticación.
 * Los sistemas consumidores deben importar ÚNICAMENTE desde este archivo.
 *
 * @example
 * // En el módulo de un sistema consumidor:
 * import { AuthModule, AuthUser, Public, Roles, Permissions, CurrentUser } from '@/modules/auth';
 */

// ─── Módulo NestJS ────────────────────────────────────────────────────────────
export { AuthModule } from './auth.module';

// ─── Interfaces públicas ──────────────────────────────────────────────────────
export type { AuthUser }    from './interfaces/auth-user.interface';
export type { JwtPayload }  from './interfaces/jwt-payload.interface';
export type { TokenPair }   from './interfaces/token-pair.interface';

// ─── Decoradores (para usar en controllers del sistema consumidor) ─────────────
export { Public }       from './decorators/public.decorator';
export { Roles }        from './decorators/roles.decorator';
export { Permissions }  from './decorators/permissions.decorator';
export { CurrentUser }  from './decorators/current-user.decorator';

// ─── Guards (solo si el consumidor necesita aplicarlos manualmente) ────────────
export { JwtAuthGuard }     from './guards/jwt-auth.guard';
export { RolesGuard }       from './guards/roles.guard';
export { PermissionsGuard } from './guards/permissions.guard';

// ─── Servicios (para inyectar en servicios del sistema consumidor) ─────────────
export { AuthService }   from './services/auth.service';
export { TokenService }  from './services/token.service';
export { SesionService } from './services/sesion.service';
