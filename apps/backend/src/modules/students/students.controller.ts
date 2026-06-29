import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Student } from "@courses/shared";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentResponseDto } from "./dto/student-response.dto";
import { StudentsService } from "./students.service";

@ApiTags("students")
@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: "Listar estudiantes" })
  @ApiOkResponse({ type: StudentResponseDto, isArray: true })
  findAll(): Student[] {
    return this.studentsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener estudiante por id" })
  @ApiParam({ name: "id", example: "student_ana" })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiNotFoundResponse({ description: "Estudiante no encontrado" })
  findById(@Param("id") id: string): Student {
    return this.studentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear estudiante" })
  @ApiCreatedResponse({ type: StudentResponseDto })
  create(@Body() input: CreateStudentDto): Student {
    return this.studentsService.create(input);
  }
}
