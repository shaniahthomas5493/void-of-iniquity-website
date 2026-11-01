import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";
const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";
const validUrl = (v: string) => {
  if (!v) return true;
  try { const u = new URL(v); return u.protocol === "https:" || u.protocol === "http:"; } catch { return false; }
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.guildMember) return NextResponse.json({ error: "Sign in with a verified Void member account to submit." }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid submission data." }, { status: 400 }); }
  const type = clean(body.submission_type, 20);
  const name = clean(body.display_name, 80);
  const description = clean(body.description, 1200);
  const category = clean(body.category, 80);
  const website = clean(body.website_url, 500);
  const social = clean(body.social_url, 500);
  const image = clean(body.featured_image_url, 500);
  if (!["author", "artisan"].includes(type) || name.length < 2 || description.length < 20 || category.length < 2)
    return NextResponse.json({ error: "Complete all required fields. Descriptions must be at least 20 characters." }, { status: 400 });
  if (![website, social, image].every(validUrl)) return NextResponse.json({ error: "Links must be valid http or https URLs." }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin().from("exchange_submissions").insert({
      user_id: session.user.id, discord_name: session.user.name ?? "Void Member",
      submission_type: type, display_name: name, description, category,
      website_url: website || null, social_url: social || null, featured_image_url: image || null
    });
    if (error) throw error;
    return NextResponse.json({ message: "Your submission has entered the review queue." }, { status: 201 });
  } catch (error) {
    console.error("Infernal Exchange submission failed:", error);
    return NextResponse.json({ error: "The submission could not be saved. Please try again later." }, { status: 500 });
  }
}
