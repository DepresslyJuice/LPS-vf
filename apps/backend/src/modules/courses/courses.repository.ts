import { Injectable } from "@nestjs/common";
import { Course, CreateCourseInput, UpdateCourseInput } from "@courses/shared";
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
}
