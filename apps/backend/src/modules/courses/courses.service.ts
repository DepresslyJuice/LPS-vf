import { Injectable, NotFoundException } from "@nestjs/common";
import { Course, CreateCourseInput } from "@courses/shared";
import { CoursesRepository } from "./courses.repository";

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  findAll(): Course[] {
    return this.coursesRepository.findAll();
  }

  findById(id: string): Course {
    const course = this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course ${id} was not found`);
    }

    return course;
  }

  create(input: CreateCourseInput): Course {
    return this.coursesRepository.create(input);
  }
}
