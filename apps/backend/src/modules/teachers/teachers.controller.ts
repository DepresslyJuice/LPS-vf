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

@ApiTags("teachers")
@Controller("teachers")
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({
    summary: "Listar profesores",
    description: "Devuelve todos los profesores registrados.",
  })
  @ApiOkResponse({ type: TeacherResponseDto, isArray: true })
  findAll(): Teacher[] {
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
  findById(@Param("id") id: string): Teacher {
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
  create(@Body() input: CreateTeacherDto): Teacher {
    return this.teachersService.create(input);
  }
}
