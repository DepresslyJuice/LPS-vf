import { Module } from "@nestjs/common";
import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";
import { TeachersModule } from "./modules/teachers/teachers.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [DatabaseModule, StudentsModule, TeachersModule, CoursesModule],
})
export class AppModule {}
