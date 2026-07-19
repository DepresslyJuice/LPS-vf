import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '@/modules/auth/entities/usuario.entity';
import { Rol } from '@/modules/auth/entities/rol.entity';

export class CreateUsersSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const usuarioRepo = dataSource.getRepository(Usuario);
    const rolRepo    = dataSource.getRepository(Rol);

    // Buscar roles ya creados por el seeder inicial
    const adminRole    = await rolRepo.findOne({ where: { nombre: 'admin' } });
    const userRole     = await rolRepo.findOne({ where: { nombre: 'user' } });
    const moderatorRole = await rolRepo.findOne({ where: { nombre: 'moderator' } });

    if (!adminRole || !userRole || !moderatorRole) {
      throw new Error(
        'Error: Los roles admin, user y moderator deben existir antes de ejecutar este seeder.',
      );
    }

    /**
     * Crea un usuario SIN pasar la relación `roles` a TypeORM.
     * Esto evita que TypeORM intente insertar en `usuarios_roles`,
     * ya que el trigger `asignar_rol_user_trigger` lo hace automáticamente
     * al insertar en `usuarios` (asigna el rol "user" a todos los nuevos usuarios).
     *
     * Para admin y moderator se agregan sus roles extra manualmente con
     * ON CONFLICT DO NOTHING para que sea idempotente.
     */
    const createUser = async (
      nombre: string,
      email: string,
      password: string,
      extraRoles: Rol[], // roles adicionales más allá de "user"
    ): Promise<void> => {
      const existente = await usuarioRepo.findOne({ where: { email } });
      if (existente) {
        console.log(`  ⏭  Usuario ${email} ya existe. Omitiendo...`);
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // Guardamos sin roles → el trigger asigna "user" automáticamente
      const nuevoUsuario = usuarioRepo.create({
        nombre,
        email,
        passwordHash,
        estado: 'activo',
      });

      const saved = await usuarioRepo.save(nuevoUsuario);
      console.log(`  ✔ Usuario creado: ${email} (id=${saved.idUsuario})`);

      // Agregar roles extra (admin, moderator, etc.) de forma idempotente
      for (const rol of extraRoles) {
        await dataSource.query(
          `INSERT INTO usuarios_roles (id_usuario, id_rol)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [saved.idUsuario, rol.idRol],
        );
        console.log(`  ✔ Rol "${rol.nombre}" asignado a ${email}`);
      }
    };

    // admin@sistema.com → trigger le da "user", aquí le sumamos "admin"
    await createUser(
      'Administrador del sistema',
      'admin@sistema.com',
      'admin123',
      [adminRole],
    );

    // user@sistema.com → trigger le da "user", no necesita extras
    await createUser(
      'Usuario estándar del sistema',
      'user@sistema.com',
      'user123',
      [],
    );

    // moderator@sistema.com → trigger le da "user", aquí le sumamos "moderator"
    await createUser(
      'Moderador del sistema',
      'moderator@sistema.com',
      'moderator123',
      [moderatorRole],
    );

    console.log('✅ Seeder de usuarios ejecutado correctamente.');
  }
}
