import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/backend/src/app.module';
import { StudentsService } from './apps/backend/src/modules/students/students.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const studentsService = app.get(StudentsService);
  
  try {
    await studentsService.create({
      name: "Test Node 500",
      email: "testnode500@email.com",
      password: "password123"
    });
    console.log("Success");
  } catch (err) {
    console.error("Caught error:", err);
  }
  
  await app.close();
}
bootstrap();
