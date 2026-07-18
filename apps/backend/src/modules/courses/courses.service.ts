import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Course,
  CourseResource,
  CourseSection,
  CreateCourseInput,
  CreateCourseResourceInput,
  CreateCourseSectionInput,
  Student,
  UpdateCourseInput,
  UpdateCourseResourceInput,
  UpdateCourseSectionInput,
  Quiz,
  CreateQuizInput,
} from "@courses/shared";
import { StudentsService } from "../students/students.service";
import { TeachersService } from "../teachers/teachers.service";
import { CoursesRepository } from "./courses.repository";

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {}

  async findAll(filters?: { teacherId?: string }): Promise<Course[]> {
    return this.coursesRepository.findAll(filters);
  }

  async findById(id: string): Promise<Course> {
    const course = await this.coursesRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course ${id} was not found`);
    }

    return course;
  }

  async create(input: CreateCourseInput): Promise<Course> {
    await this.teachersService.findById(input.teacherId);
    return this.coursesRepository.create(input);
  }

  async update(id: string, input: UpdateCourseInput): Promise<Course> {
    if (input.teacherId) {
      await this.teachersService.findById(input.teacherId);
    }

    const course = await this.coursesRepository.update(id, input);

    if (!course) {
      throw new NotFoundException(`Course ${id} was not found`);
    }

    return course;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.coursesRepository.delete(id);
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Student> {
    const course = await this.findById(courseId);
    const student = await this.studentsService.findById(studentId);

    if (student.enrolledCourseIds.includes(courseId)) {
      throw new ConflictException(
        `Student ${studentId} is already enrolled in course ${courseId}`,
      );
    }

    const enrolledStudents = await this.findEnrolledStudents(courseId);

    if (enrolledStudents.length >= course.capacity) {
      throw new ConflictException(`Course ${courseId} has no available seats`);
    }

    return this.studentsService.updateEnrolledCourseIds(studentId, [
      ...student.enrolledCourseIds,
      courseId,
    ]);
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<Student> {
    await this.findById(courseId);
    const student = await this.studentsService.findById(studentId);

    if (!student.enrolledCourseIds.includes(courseId)) {
      throw new ConflictException(
        `Student ${studentId} is not enrolled in course ${courseId}`,
      );
    }

    return this.studentsService.updateEnrolledCourseIds(
      studentId,
      student.enrolledCourseIds.filter(
        (enrolledCourseId) => enrolledCourseId !== courseId,
      ),
    );
  }

  async findEnrolledStudents(courseId: string): Promise<Student[]> {
    await this.findById(courseId);
    const students = await this.studentsService.findAll();

    return students.filter((student) =>
      student.enrolledCourseIds.includes(courseId),
    );
  }

  async findSections(courseId: string): Promise<CourseSection[]> {
    await this.findById(courseId);
    return this.coursesRepository.findSections(courseId);
  }

  async findSectionById(sectionId: string): Promise<CourseSection> {
    const section = await this.coursesRepository.findSectionById(sectionId);

    if (!section) {
      throw new NotFoundException(`Course section ${sectionId} was not found`);
    }

    return section;
  }

  async createSection(
    courseId: string,
    input: Omit<CreateCourseSectionInput, "courseId">,
  ): Promise<CourseSection> {
    await this.findById(courseId);
    return this.coursesRepository.createSection({ ...input, courseId });
  }

  async updateSection(
    sectionId: string,
    input: UpdateCourseSectionInput,
  ): Promise<CourseSection> {
    const section = await this.coursesRepository.updateSection(
      sectionId,
      input,
    );

    if (!section) {
      throw new NotFoundException(`Course section ${sectionId} was not found`);
    }

    return section;
  }

  async deleteSection(sectionId: string): Promise<void> {
    await this.findSectionById(sectionId);
    await this.coursesRepository.deleteSection(sectionId);
  }

  async findResources(sectionId: string): Promise<CourseResource[]> {
    await this.findSectionById(sectionId);
    return this.coursesRepository.findResources(sectionId);
  }

  async createResource(
    sectionId: string,
    input: Omit<CreateCourseResourceInput, "sectionId">,
  ): Promise<CourseResource> {
    await this.findSectionById(sectionId);
    return this.coursesRepository.createResource({ ...input, sectionId });
  }

  async updateResource(
    resourceId: string,
    input: UpdateCourseResourceInput,
  ): Promise<CourseResource> {
    const resource = await this.coursesRepository.updateResource(
      resourceId,
      input,
    );

    if (!resource) {
      throw new NotFoundException(`Course resource ${resourceId} was not found`);
    }

    return resource;
  }

  async deleteResource(resourceId: string): Promise<void> {
    await this.coursesRepository.deleteResource(resourceId);
  }

  async findQuizzes(sectionId: string): Promise<Quiz[]> {
    await this.findSectionById(sectionId);
    return this.coursesRepository.findQuizzes(sectionId);
  }

  async createQuiz(
    sectionId: string,
    input: Omit<CreateQuizInput, "sectionId">,
  ): Promise<Quiz> {
    await this.findSectionById(sectionId);
    return this.coursesRepository.createQuiz({ ...input, sectionId });
  }

  async deleteQuiz(quizId: string): Promise<void> {
    await this.coursesRepository.deleteQuiz(quizId);
  }
}
