import { Module } from "@nestjs/common";
import { StudentsModule } from "../students/students.module";
import { TeachersModule } from "../teachers/teachers.module";
import { CoursesController } from "./courses.controller";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";

@Module({
  imports: [StudentsModule, TeachersModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
