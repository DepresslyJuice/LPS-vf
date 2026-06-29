import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Teacher } from "@courses/shared";
import {
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
  @ApiOperation({ summary: "Listar profesores" })
  @ApiOkResponse({ type: TeacherResponseDto, isArray: true })
  findAll(): Teacher[] {
    return this.teachersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener profesor por id" })
  @ApiParam({ name: "id", example: "teacher_luis" })
  @ApiOkResponse({ type: TeacherResponseDto })
  @ApiNotFoundResponse({ description: "Profesor no encontrado" })
  findById(@Param("id") id: string): Teacher {
    return this.teachersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear profesor" })
  @ApiCreatedResponse({ type: TeacherResponseDto })
  create(@Body() input: CreateTeacherDto): Teacher {
    return this.teachersService.create(input);
  }
}
