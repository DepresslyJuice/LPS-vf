import { Injectable } from "@nestjs/common";
import { CreateStudentInput, Student, UpdateStudentInput } from "@courses/shared";
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

  async findByEmail(email: string): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from<Student>("students")
      .select("*")
      .eq("email", email)
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

  async update(
    id: string,
    input: UpdateStudentInput,
  ): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from<Student>("students")
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
      .from<Student>("students")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async updateEnrolledCourseIds(
    id: string,
    enrolledCourseIds: string[],
  ): Promise<Student | undefined> {
    const { data, error } = await this.supabase
      .from<Student>("students")
      .update({ enrolledCourseIds })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }
}
