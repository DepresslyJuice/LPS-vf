import { Injectable } from "@nestjs/common";
import { CreateTeacherInput, Teacher } from "@courses/shared";
import { SupabaseService } from "../../database/supabase.service";

@Injectable()
export class TeachersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Teacher[]> {
    const { data, error } = await this.supabase
      .from<Teacher>("teachers")
      .select("*");

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async findById(id: string): Promise<Teacher | undefined> {
    const { data, error } = await this.supabase
      .from<Teacher>("teachers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ?? undefined;
  }

  async create(input: CreateTeacherInput): Promise<Teacher> {
    const { data, error } = await this.supabase
      .from<Teacher>("teachers")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Teacher;
  }
}
