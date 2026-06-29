import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Course } from "@courses/shared";
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
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseResponseDto } from "./dto/course-response.dto";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: "Listar cursos",
    description: "Devuelve todos los cursos disponibles.",
  })
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  findAll(): Course[] {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener curso por id",
    description: "Devuelve el detalle individual de un curso.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiOkResponse({ type: CourseResponseDto })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  findById(@Param("id") id: string): Course {
    return this.coursesService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: "Crear curso",
    description: "Registra un curso nuevo asociado a un profesor.",
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiCreatedResponse({ type: CourseResponseDto })
  @ApiBadRequestResponse({ description: "Datos de curso invalidos" })
  create(@Body() input: CreateCourseDto): Course {
    return this.coursesService.create(input);
  }
}
