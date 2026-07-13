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
import { Course, Student } from "@courses/shared";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
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
import { StudentResponseDto } from "../students/dto/student-response.dto";

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

  @Get(":id/students")
  @ApiOperation({
    summary: "Listar estudiantes matriculados",
    description: "Devuelve los estudiantes matriculados en un curso.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiOkResponse({ type: StudentResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async findEnrolledStudents(@Param("id") id: string): Promise<Student[]> {
    return this.coursesService.findEnrolledStudents(id);
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

  @Post(":courseId/students/:studentId")
  @ApiOperation({
    summary: "Matricular estudiante en curso",
    description: "Matricula un estudiante existente en un curso con cupos.",
  })
  @ApiParam({ name: "courseId", example: "course_react" })
  @ApiParam({ name: "studentId", example: "student_ana" })
  @ApiCreatedResponse({ type: StudentResponseDto })
  @ApiConflictResponse({
    description: "Estudiante ya matriculado o curso sin cupos",
  })
  @ApiNotFoundResponse({ description: "Curso o estudiante no encontrado" })
  async enrollStudent(
    @Param("courseId") courseId: string,
    @Param("studentId") studentId: string,
  ): Promise<Student> {
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Delete(":courseId/students/:studentId")
  @ApiOperation({
    summary: "Retirar matricula de estudiante",
    description: "Retira un estudiante matriculado en un curso.",
  })
  @ApiParam({ name: "courseId", example: "course_react" })
  @ApiParam({ name: "studentId", example: "student_ana" })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiConflictResponse({ description: "El estudiante no esta matriculado" })
  @ApiNotFoundResponse({ description: "Curso o estudiante no encontrado" })
  async unenrollStudent(
    @Param("courseId") courseId: string,
    @Param("studentId") studentId: string,
  ): Promise<Student> {
    return this.coursesService.unenrollStudent(courseId, studentId);
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
