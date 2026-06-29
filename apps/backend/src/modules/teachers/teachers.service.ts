import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTeacherInput, Teacher } from "@courses/shared";
import { TeachersRepository } from "./teachers.repository";

@Injectable()
export class TeachersService {
  constructor(private readonly teachersRepository: TeachersRepository) {}

  findAll(): Teacher[] {
    return this.teachersRepository.findAll();
  }

  findById(id: string): Teacher {
    const teacher = this.teachersRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException(`Teacher ${id} was not found`);
    }

    return teacher;
  }

  create(input: CreateTeacherInput): Teacher {
    return this.teachersRepository.create(input);
  }
}
