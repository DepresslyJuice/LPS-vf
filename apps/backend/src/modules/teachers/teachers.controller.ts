import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Teacher } from "@courses/shared";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { TeacherResponseDto } from "./dto/teacher-response.dto";
import { TeachersService } from "./teachers.service";

import { Public } from "@/modules/auth/decorators/public.decorator";

@ApiTags("teachers")
@Public()
@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({
    summary: "Listar profesores",
    description: "Devuelve todos los profesores registrados.",
  })
  @ApiOkResponse({ type: TeacherResponseDto, isArray: true })
  async findAll(): Promise<Teacher[]> {
    return this.teachersService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener profesor por id",
    description: "Devuelve el detalle individual de un profesor.",
  })
  @ApiParam({ name: "id", example: "teacher_luis" })
  @ApiOkResponse({ type: TeacherResponseDto })
  @ApiNotFoundResponse({ description: "Profesor no encontrado" })
  async findById(@Param("id") id: string): Promise<Teacher> {
    return this.teachersService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: "Crear profesor",
    description: "Registra un profesor nuevo con especialidad academica.",
  })
  @ApiBody({ type: CreateTeacherDto })
  @ApiCreatedResponse({ type: TeacherResponseDto })
  @ApiBadRequestResponse({ description: "Datos de profesor invalidos" })
  async create(@Body() input: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(input);
  }
}
