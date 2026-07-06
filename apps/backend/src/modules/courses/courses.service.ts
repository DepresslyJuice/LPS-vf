import { Injectable, NotFoundException } from "@nestjs/common";
import { Course, CreateCourseInput } from "@courses/shared";
import { CoursesRepository } from "./courses.repository";

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.findAll();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course ${id} was not found`);
    }

    return course;
  }

  async create(input: CreateCourseInput): Promise<Course> {
    return this.coursesRepository.create(input);
  }
}
