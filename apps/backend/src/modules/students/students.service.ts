import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentInput, Student, UpdateStudentInput } from "@courses/shared";
import { StudentsRepository } from "./students.repository";

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.findAll();
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentsRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }

  async create(input: CreateStudentInput): Promise<Student> {
    return this.studentsRepository.create(input);
  }

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    const student = await this.studentsRepository.update(id, input);

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.studentsRepository.delete(id);
  }

  async updateEnrolledCourseIds(
    id: string,
    enrolledCourseIds: string[],
  ): Promise<Student> {
    const student = await this.studentsRepository.updateEnrolledCourseIds(
      id,
      enrolledCourseIds,
    );

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }
}
