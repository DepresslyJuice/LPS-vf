import { Injectable } from "@nestjs/common";
import { Course, CreateCourseInput } from "@courses/shared";
import { SupabaseService } from "../../database/supabase.service";

@Injectable()
export class CoursesRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from<Course>("courses")
      .select("*");

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
}
