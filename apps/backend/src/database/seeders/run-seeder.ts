import { config } from 'dotenv';
config(); // ← debe ir ANTES de importar SeguridadDataSource

import { SeguridadDataSource } from '@/config/typeorm.seguridad';
import { seedInitialData } from './initial-seed';
import { CreateUsersSeeder } from './user.seeder';

async function bootstrap() {
  console.log('🌱 Iniciando seeders...');

  try {
    await SeguridadDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    // ----------------------------------------
    console.log('----------------------------------------');
    console.log('    EJECUTANDO SEED INITIAL (ROLES + PERMISOS)');
    console.log('----------------------------------------');
    await seedInitialData(SeguridadDataSource);

    // ----------------------------------------
    console.log('----------------------------------------');
    console.log('    EJECUTANDO SEED USERS');
    console.log('----------------------------------------');
    const userSeeder = new CreateUsersSeeder();
    await userSeeder.run(SeguridadDataSource);

    console.log('🎉 Todos los seeders ejecutados correctamente.');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  } finally {
    if (SeguridadDataSource.isInitialized) {
      await SeguridadDataSource.destroy();
    }
  }
}

bootstrap();
