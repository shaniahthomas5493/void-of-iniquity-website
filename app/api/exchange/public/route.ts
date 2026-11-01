import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";
export const runtime = "nodejs";
export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin().from("exchange_submissions")
      .select("id, submission_type, display_name, description, category, website_url, social_url, featured_image_url, created_at")
      .eq("status", "approved").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ listings: data ?? [] });
  } catch (error) {
    console.error("Infernal Exchange listings failed:", error);
    return NextResponse.json({ error: "Listings are temporarily unavailable." }, { status: 500 });
  }
}
