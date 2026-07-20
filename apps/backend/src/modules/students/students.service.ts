import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { CreateStudentWithPasswordInput, Student, UpdateStudentInput } from "@courses/shared";
import { StudentsRepository } from "./students.repository";
import { UsuariosService } from "@/modules/usuarios/services/usuarios.service";

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly usuariosService: UsuariosService,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.findAll();
  }

  async findByEmail(email: string): Promise<Student | undefined> {
    return this.studentsRepository.findByEmail(email);
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentsRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }

  async create(input: CreateStudentWithPasswordInput): Promise<Student> {
    // 1. Crear estudiante en Supabase (core asset)
    const { password, ...studentData } = input;
    const student = await this.studentsRepository.create(studentData);

    // 2. Crear usuario de autenticación con rol 'estudiante'
    try {
      await this.usuariosService.createStudentUser({
        nombre: student.name,
        email: student.email,
        password,
      });
    } catch (error: any) {
      // Si el email ya tiene usuario no es error crítico
      if (!error?.message?.includes('ya está registrado')) {
        // Revertir creación del estudiante para mantener consistencia
        await this.studentsRepository.delete(student.id).catch(() => {});
        throw new InternalServerErrorException(
          `Estudiante creado pero no se pudo crear el usuario: ${error?.message}`,
        );
      }
    }

    return student;
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
