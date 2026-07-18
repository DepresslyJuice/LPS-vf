import { Injectable } from "@nestjs/common";
import {
  Course,
  CourseResource,
  CourseSection,
  CreateCourseInput,
  CreateCourseResourceInput,
  CreateCourseSectionInput,
  UpdateCourseInput,
  UpdateCourseResourceInput,
  UpdateCourseSectionInput,
  Quiz,
  CreateQuizInput,
} from "@courses/shared";
import { SupabaseService } from "../../database/supabase.service";

@Injectable()
export class CoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(filters?: { teacherId?: string }): Promise<Course[]> {
    let query = this.supabase.from<Course>("courses").select("*");

    if (filters?.teacherId) {
      query = query.eq("teacherId", filters.teacherId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async findById(id: string): Promise<Course | undefined> {
    const { data, error } = await this.supabase
      .from<Course>("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async create(input: CreateCourseInput): Promise<Course> {
    const { data, error } = await this.supabase
      .from<Course>("courses")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Course;
  }

  async update(
    id: string,
    input: UpdateCourseInput,
  ): Promise<Course | undefined> {
    const { data, error } = await this.supabase
      .from<Course>("courses")
      .update(input)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from<Course>("courses")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async findSections(courseId: string): Promise<CourseSection[]> {
    const { data, error } = await this.supabase
      .from<CourseSection>("course_sections")
      .select("*")
      .eq("courseId", courseId)
      .order("order", { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async findSectionById(id: string): Promise<CourseSection | undefined> {
    const { data, error } = await this.supabase
      .from<CourseSection>("course_sections")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async createSection(
    input: CreateCourseSectionInput,
  ): Promise<CourseSection> {
    const { data, error } = await this.supabase
      .from<CourseSection>("course_sections")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as CourseSection;
  }

  async updateSection(
    id: string,
    input: UpdateCourseSectionInput,
  ): Promise<CourseSection | undefined> {
    const { data, error } = await this.supabase
      .from<CourseSection>("course_sections")
      .update(input)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async deleteSection(id: string): Promise<void> {
    const { error } = await this.supabase
      .from<CourseSection>("course_sections")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async findResources(sectionId: string): Promise<CourseResource[]> {
    const { data, error } = await this.supabase
      .from<CourseResource>("course_resources")
      .select("*")
      .eq("sectionId", sectionId)
      .order("title", { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async createResource(
    input: CreateCourseResourceInput,
  ): Promise<CourseResource> {
    const { data, error } = await this.supabase
      .from<CourseResource>("course_resources")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as CourseResource;
  }

  async updateResource(
    id: string,
    input: UpdateCourseResourceInput,
  ): Promise<CourseResource | undefined> {
    const { data, error } = await this.supabase
      .from<CourseResource>("course_resources")
      .update(input)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async deleteResource(id: string): Promise<void> {
    const { error } = await this.supabase
      .from<CourseResource>("course_resources")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async findQuizzes(sectionId: string): Promise<Quiz[]> {
    const { data, error } = await this.supabase
      .from<Quiz>("quizzes")
      .select("*")
      .eq("sectionId", sectionId)
      .order("title", { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async createQuiz(input: CreateQuizInput): Promise<Quiz> {
    const { data, error } = await this.supabase
      .from<Quiz>("quizzes")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Quiz;
  }

  async deleteQuiz(id: string): Promise<void> {
    const { error } = await this.supabase
      .from<Quiz>("quizzes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}
