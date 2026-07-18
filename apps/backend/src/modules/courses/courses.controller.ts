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
import { Course, CourseResource, CourseSection, Quiz, Student } from "@courses/shared";
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
import { CreateCourseSectionDto } from "./dto/create-course-section.dto";
import { UpdateCourseSectionDto } from "./dto/update-course-section.dto";
import { CourseSectionResponseDto } from "./dto/course-section-response.dto";
import { CreateCourseResourceDto } from "./dto/create-course-resource.dto";
import { UpdateCourseResourceDto } from "./dto/update-course-resource.dto";
import { CourseResourceResponseDto } from "./dto/course-resource-response.dto";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { QuizResponseDto } from "./dto/quiz-response.dto";

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

  @Get(":id/sections")
  @ApiOperation({
    summary: "Listar secciones del curso",
    description: "Devuelve las secciones o temas de un curso.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiOkResponse({ type: CourseSectionResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async findSections(@Param("id") id: string): Promise<CourseSection[]> {
    return this.coursesService.findSections(id);
  }

  @Post(":id/sections")
  @ApiOperation({
    summary: "Crear seccion de curso",
    description: "Crea una seccion o tema dentro de un curso.",
  })
  @ApiParam({ name: "id", example: "course_react" })
  @ApiBody({ type: CreateCourseSectionDto })
  @ApiCreatedResponse({ type: CourseSectionResponseDto })
  @ApiBadRequestResponse({ description: "Datos de seccion invalidos" })
  @ApiNotFoundResponse({ description: "Curso no encontrado" })
  async createSection(
    @Param("id") id: string,
    @Body() input: CreateCourseSectionDto,
  ): Promise<CourseSection> {
    return this.coursesService.createSection(id, input);
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

  @Get("sections/:sectionId/resources")
  @ApiOperation({
    summary: "Listar recursos de seccion",
    description: "Devuelve recursos simples asociados a una seccion.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiOkResponse({ type: CourseResourceResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async findResources(
    @Param("sectionId") sectionId: string,
  ): Promise<CourseResource[]> {
    return this.coursesService.findResources(sectionId);
  }

  @Post("sections/:sectionId/resources")
  @ApiOperation({
    summary: "Crear recurso de seccion",
    description: "Crea un recurso tipo texto o enlace dentro de una seccion.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiBody({ type: CreateCourseResourceDto })
  @ApiCreatedResponse({ type: CourseResourceResponseDto })
  @ApiBadRequestResponse({ description: "Datos de recurso invalidos" })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async createResource(
    @Param("sectionId") sectionId: string,
    @Body() input: CreateCourseResourceDto,
  ): Promise<CourseResource> {
    return this.coursesService.createResource(sectionId, input);
  }

  @Patch("sections/:sectionId")
  @ApiOperation({
    summary: "Actualizar seccion",
    description: "Actualiza parcialmente una seccion de curso.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiBody({ type: UpdateCourseSectionDto })
  @ApiOkResponse({ type: CourseSectionResponseDto })
  @ApiBadRequestResponse({ description: "Datos de seccion invalidos" })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async updateSection(
    @Param("sectionId") sectionId: string,
    @Body() input: UpdateCourseSectionDto,
  ): Promise<CourseSection> {
    return this.coursesService.updateSection(sectionId, input);
  }

  @Delete("sections/:sectionId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Eliminar seccion",
    description: "Elimina una seccion y sus recursos asociados.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiNoContentResponse({ description: "Seccion eliminada" })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async deleteSection(@Param("sectionId") sectionId: string): Promise<void> {
    await this.coursesService.deleteSection(sectionId);
  }

  @Patch("resources/:resourceId")
  @ApiOperation({
    summary: "Actualizar recurso",
    description: "Actualiza parcialmente un recurso de curso.",
  })
  @ApiParam({ name: "resourceId", example: "resource_1" })
  @ApiBody({ type: UpdateCourseResourceDto })
  @ApiOkResponse({ type: CourseResourceResponseDto })
  @ApiBadRequestResponse({ description: "Datos de recurso invalidos" })
  @ApiNotFoundResponse({ description: "Recurso no encontrado" })
  async updateResource(
    @Param("resourceId") resourceId: string,
    @Body() input: UpdateCourseResourceDto,
  ): Promise<CourseResource> {
    return this.coursesService.updateResource(resourceId, input);
  }

  @Delete("resources/:resourceId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Eliminar recurso",
    description: "Elimina un recurso de curso.",
  })
  @ApiParam({ name: "resourceId", example: "resource_1" })
  @ApiNoContentResponse({ description: "Recurso eliminado" })
  @ApiNotFoundResponse({ description: "Recurso no encontrado" })
  async deleteResource(@Param("resourceId") resourceId: string): Promise<void> {
    await this.coursesService.deleteResource(resourceId);
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

  @Get("sections/:sectionId/quizzes")
  @ApiOperation({
    summary: "Listar cuestionarios de seccion",
    description: "Devuelve los cuestionarios asociados a una seccion.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiOkResponse({ type: QuizResponseDto, isArray: true })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async findQuizzes(
    @Param("sectionId") sectionId: string,
  ): Promise<Quiz[]> {
    return this.coursesService.findQuizzes(sectionId);
  }

  @Post("sections/:sectionId/quizzes")
  @ApiOperation({
    summary: "Crear cuestionario de seccion",
    description: "Crea un cuestionario dentro de una seccion.",
  })
  @ApiParam({ name: "sectionId", example: "section_1" })
  @ApiBody({ type: CreateQuizDto })
  @ApiCreatedResponse({ type: QuizResponseDto })
  @ApiBadRequestResponse({ description: "Datos de cuestionario invalidos" })
  @ApiNotFoundResponse({ description: "Seccion no encontrada" })
  async createQuiz(
    @Param("sectionId") sectionId: string,
    @Body() input: CreateQuizDto,
  ): Promise<Quiz> {
    return this.coursesService.createQuiz(sectionId, input);
  }

  @Delete("quizzes/:quizId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Eliminar cuestionario",
    description: "Elimina un cuestionario.",
  })
  @ApiParam({ name: "quizId", example: "quiz_1" })
  @ApiNoContentResponse({ description: "Cuestionario eliminado" })
  @ApiNotFoundResponse({ description: "Cuestionario no encontrado" })
  async deleteQuiz(@Param("quizId") quizId: string): Promise<void> {
    await this.coursesService.deleteQuiz(quizId);
  }
}
