import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Course,
  CreateCourseInput,
  Student,
  UpdateCourseInput,
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

  async findEnrolledStudents(courseId: string): Promise<Student[]> {
    await this.findById(courseId);
    const students = await this.studentsService.findAll();

    return students.filter((student) =>
      student.enrolledCourseIds.includes(courseId),
    );
  }
}
