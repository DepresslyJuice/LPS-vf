import { Injectable } from "@nestjs/common";
import { CreateStudentInput, Student } from "@courses/shared";
import { createId } from "../../common/id";

@Injectable()
export class StudentsRepository {
  private readonly students = new Map<string, Student>([
    [
      "student_ana",
      {
        id: "student_ana",
        name: "Ana Torres",
        email: "ana.torres@example.com",
        enrolledCourseIds: ["course_react"],
      },
    ],
  ]);

  findAll(): Student[] {
    return [...this.students.values()];
  }

  findById(id: string): Student | undefined {
    return this.students.get(id);
  }

  create(input: CreateStudentInput): Student {
    const student: Student = {
      id: createId("student"),
      enrolledCourseIds: [],
      ...input,
    };

    this.students.set(student.id, student);
    return student;
  }
}
