import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Course } from "@courses/shared";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseResponseDto } from "./dto/course-response.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: "Listar cursos",
    description: "Devuelve todos los cursos disponibles.",
  })
  @ApiQuery({
    name: "teacherId",
    required: false,
    example: "teacher_luis",
    description: "Filtra cursos asignados a un docente.",
  })
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  async findAll(@Query("teacherId") teacherId?: string): Promise<Course[]> {
    return this.coursesService.findAll({ teacherId });
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener curso por id",
    description: "Devuelve el detalle individual de un curso.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiOkResponse({ type: CourseResponseDto })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async findById(@Param("id") id: string): Promise<Course> {
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
  async create(@Body() input: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(input);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Actualizar curso",
    description: "Actualiza parcialmente un curso existente.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiBody({ type: UpdateCourseDto })
  @ApiOkResponse({ type: CourseResponseDto })
  @ApiBadRequestResponse({ description: "Datos de curso invalidos" })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async update(
    @Param("id") id: string,
    @Body() input: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, input);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({
    summary: "Eliminar curso",
    description: "Elimina un curso existente.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiNoContentResponse({ description: "Curso eliminado" })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async delete(@Param("id") id: string): Promise<void> {
    await this.coursesService.delete(id);
  }
}
