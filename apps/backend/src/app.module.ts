import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";
import { TeachersModule } from "./modules/teachers/teachers.module";
import { DatabaseModule } from "./database/database.module";

// Core Asset Modules
import { AuthModule } from '@/modules/auth/auth.module';
import { UsuariosModule } from '@/modules/usuarios/usuarios.module';
import { RolesModule } from '@/modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    RolesModule,
    StudentsModule,
    TeachersModule,
    CoursesModule
  ],
})
export class AppModule {}
