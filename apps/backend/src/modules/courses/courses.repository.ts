import { Injectable } from "@nestjs/common";
import { Course, CreateCourseInput } from "@courses/shared";
import { createId } from "../../common/id";

@Injectable()
export class CoursesRepository {
  private readonly courses = new Map<string, Course>([
    [
      "course_react",
      {
        id: "course_react",
        title: "React con Vite",
        description: "Curso practico para construir interfaces modernas.",
        teacherId: "teacher_luis",
        capacity: 30,
      },
    ],
  ]);

  findAll(): Course[] {
    return [...this.courses.values()];
  }

  findById(id: string): Course | undefined {
    return this.courses.get(id);
  }

  create(input: CreateCourseInput): Course {
    const course: Course = {
      id: createId("course"),
      ...input,
    };

    this.courses.set(course.id, course);
    return course;
  }
}
