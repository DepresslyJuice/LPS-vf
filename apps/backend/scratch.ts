import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function run() {
  const { data, error } = await supabase
    .from("students")
    .insert({
      name: "Test Node",
      email: "testnode@test.com",
      usuarioId: 1
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success:", data);
  }
}

run();
