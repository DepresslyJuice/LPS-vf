import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentInput, Student } from "@courses/shared";
import { StudentsRepository } from "./students.repository";

@Injectable()
export class StudentsService {
  constructor(private readonly studentsRepository: StudentsRepository) {}

  findAll(): Student[] {
    return this.studentsRepository.findAll();
  }

  findById(id: string): Student {
    const student = this.studentsRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }

  create(input: CreateStudentInput): Student {
    return this.studentsRepository.create(input);
  }
}
