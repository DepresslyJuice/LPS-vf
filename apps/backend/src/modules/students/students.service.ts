import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentInput, Student } from "@courses/shared";
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
}
