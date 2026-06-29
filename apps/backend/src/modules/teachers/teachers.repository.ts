import { Injectable } from "@nestjs/common";
import { CreateTeacherInput, Teacher } from "@courses/shared";
import { createId } from "../../common/id";

@Injectable()
export class TeachersRepository {
  private readonly teachers = new Map<string, Teacher>([
    [
      "teacher_luis",
      {
        id: "teacher_luis",
        name: "Luis Andrade",
        email: "luis.andrade@example.com",
        specialty: "Desarrollo web",
      },
    ],
  ]);

  findAll(): Teacher[] {
    return [...this.teachers.values()];
  }

  findById(id: string): Teacher | undefined {
    return this.teachers.get(id);
  }

  create(input: CreateTeacherInput): Teacher {
    const teacher: Teacher = {
      id: createId("teacher"),
      ...input,
    };

    this.teachers.set(teacher.id, teacher);
    return teacher;
  }
}
