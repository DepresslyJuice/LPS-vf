import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
      );
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  from<T>(table: string) {
    return this.client.from(table) as ReturnType<SupabaseClient["from"]> & {
      select: ReturnType<SupabaseClient["from"]>["select"];
    };
  }

  getClient() {
    return this.client;
  }
}
