import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from "@nestjs/common";
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
    const { password, ...studentDataOriginal } = input;
    
    // 1. Crear usuario de autenticación con rol 'estudiante'
    let usuario;
    try {
      usuario = await this.usuariosService.createStudentUser({
        nombre: input.name,
        email: input.email,
        password,
      });
    } catch (error: any) {
      if (error?.message?.includes('ya está registrado')) {
        throw new BadRequestException('El email ya está registrado en el sistema.');
      }
      throw error;
    }

    // 2. Crear estudiante en Supabase con el ID del usuario
    try {
      const studentData = { ...studentDataOriginal, usuarioId: usuario.idUsuario };
      const student = await this.studentsRepository.create(studentData);
      return student;
    } catch (error: any) {
      // Revertir creación de usuario si falla Supabase
      await this.usuariosService.remove(usuario.idUsuario).catch(() => {});
      throw new InternalServerErrorException(
        `Error creando el estudiante en la base de datos principal: ${error?.message}`,
      );
    }
  }

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    const student = await this.studentsRepository.update(id, input);

    if (!student) {
      throw new NotFoundException(`Student ${id} was not found`);
    }

    return student;
  }

  async delete(id: string): Promise<void> {
    const student = await this.findById(id);
    await this.studentsRepository.delete(id);
    if (student.usuarioId) {
      await this.usuariosService.remove(student.usuarioId).catch(() => {});
    }
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
