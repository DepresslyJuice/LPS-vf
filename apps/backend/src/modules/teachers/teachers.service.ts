import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTeacherInput, Teacher } from "@courses/shared";
import { TeachersRepository } from "./teachers.repository";

@Injectable()
export class TeachersService {
  constructor(private readonly teachersRepository: TeachersRepository) {}

  async findAll(): Promise<Teacher[]> {
    return this.teachersRepository.findAll();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teachersRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException(`Teacher ${id} was not found`);
    }

    return teacher;
  }

  async create(input: CreateTeacherInput): Promise<Teacher> {
    return this.teachersRepository.create(input);
  }
}
