import { Module } from "@nestjs/common";
import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";
import { TeachersModule } from "./modules/teachers/teachers.module";

@Module({
  imports: [StudentsModule, TeachersModule, CoursesModule],
})
export class AppModule {}
