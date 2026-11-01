import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
export function getSupabaseAdmin() {
  if (!url || !secretKey) throw new Error("Supabase environment variables are not configured.");
  return createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
