import { Module } from "@nestjs/common";
import { StudentsController } from "./students.controller";
import { StudentsRepository } from "./students.repository";
import { StudentsService } from "./students.service";
import { UsuariosModule } from "@/modules/usuarios/usuarios.module";

@Module({
  imports: [UsuariosModule],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
