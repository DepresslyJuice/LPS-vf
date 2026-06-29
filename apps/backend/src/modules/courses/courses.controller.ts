import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Course } from "@courses/shared";
import {
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
  @ApiOperation({ summary: "Listar cursos" })
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  findAll(): Course[] {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener curso por id" })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiOkResponse({ type: CourseResponseDto })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  findById(@Param("id") id: string): Course {
    return this.coursesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear curso" })
  @ApiCreatedResponse({ type: CourseResponseDto })
  create(@Body() input: CreateCourseDto): Course {
    return this.coursesService.create(input);
  }
}
