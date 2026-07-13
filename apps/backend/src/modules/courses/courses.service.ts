import { Injectable, NotFoundException } from "@nestjs/common";
import { Course, CreateCourseInput, UpdateCourseInput } from "@courses/shared";
import { CoursesRepository } from "./courses.repository";

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(filters?: { teacherId?: string }): Promise<Course[]> {
    return this.coursesRepository.findAll(filters);
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

  async update(id: string, input: UpdateCourseInput): Promise<Course> {
    const course = await this.coursesRepository.update(id, input);

    if (!course) {
      throw new NotFoundException(`Course ${id} was not found`);
    }

    return course;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.coursesRepository.delete(id);
  }
}
