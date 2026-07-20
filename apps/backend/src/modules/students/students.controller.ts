import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Student } from "@courses/shared";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentResponseDto } from "./dto/student-response.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentsService } from "./students.service";

import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/modules/auth/guards/roles.guard";
import { Roles } from "@/modules/auth/decorators/roles.decorator";

@ApiTags("students")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles("admin", "tutor")
  @ApiOperation({
    summary: "Listar estudiantes",
    description: "Devuelve todos los estudiantes registrados.",
  })
  @ApiOkResponse({ type: StudentResponseDto, isArray: true })
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(":id")
  @Roles("admin", "tutor", "estudiante")
  @ApiOperation({
    summary: "Obtener estudiante por id",
    description: "Devuelve el detalle individual de un estudiante.",
  })
  @ApiParam({ name: "id", example: "student_ana" })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiNotFoundResponse({ description: "Estudiante no encontrado" })
  async findById(@Param("id") id: string): Promise<Student> {
    return this.studentsService.findById(id);
  }

  @Post()
  @Roles("admin", "tutor")
  @ApiOperation({
    summary: "Crear estudiante",
    description: "Registra un estudiante nuevo con nombre y correo.",
  })
  @ApiBody({ type: CreateStudentDto })
  @ApiCreatedResponse({ type: StudentResponseDto })
  @ApiBadRequestResponse({ description: "Datos de estudiante invalidos" })
  async create(@Body() input: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(input);
  }

  @Patch(":id")
  @Roles("admin", "tutor")
  @ApiOperation({
    summary: "Actualizar estudiante",
    description: "Actualiza parcialmente un estudiante existente.",
  })
  @ApiParam({ name: "id", example: "student_ana" })
  @ApiBody({ type: UpdateStudentDto })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiBadRequestResponse({ description: "Datos de estudiante invalidos" })
  @ApiNotFoundResponse({ description: "Estudiante no encontrado" })
  async update(
    @Param("id") id: string,
    @Body() input: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentsService.update(id, input);
  }

  @Delete(":id")
  @Roles("admin", "tutor")
  @HttpCode(204)
  @ApiOperation({
    summary: "Eliminar estudiante",
    description: "Elimina un estudiante existente.",
  })
  @ApiParam({ name: "id", example: "student_ana" })
  @ApiNoContentResponse({ description: "Estudiante eliminado" })
  @ApiNotFoundResponse({ description: "Estudiante no encontrado" })
  async delete(@Param("id") id: string): Promise<void> {
    await this.studentsService.delete(id);
  }
}
