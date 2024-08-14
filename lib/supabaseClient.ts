import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPERBASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPERBASE_PUBLIC_API_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
