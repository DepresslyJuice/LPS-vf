import { Injectable } from "@nestjs/common";
import { CreateStudentInput, Student } from "@courses/shared";
import { SupabaseService } from "../../database/supabase.service";

@Injectable()
export class StudentsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from<Student>("students")
      .select("*");

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async findById(id: string): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from<Student>("students")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async create(input: CreateStudentInput): Promise<Student> {
    const { data, error } = await this.supabase
      .from<Student>("students")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Student;
  }
}
