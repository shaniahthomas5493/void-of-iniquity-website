import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime = "nodejs";
const REAPER = "1495636529488461834";
async function current() {
  const session = await getServerSession(authOptions);
  return { session, id: session?.user?.id ?? "", member: Boolean(session?.user?.guildMember), roles: session?.user?.discordRoles ?? [] };
}
export async function GET() {
  const user = await current();
  const isReaper = user.roles.includes(REAPER);
  if (!user.member && !isReaper) {
    try {
      const { data, error } = await getSupabaseAdmin().from("inner_circle_profiles")
        .select("user_id,discord_name,avatar_url,discord_roles,display_name,bio,last_seen_at")
        .contains("discord_roles", [REAPER]).order("discord_name");
      if (error) throw error;
      return NextResponse.json({ profiles: data ?? [], visibility: "public" });
    } catch (error) {
      console.error("Public Reaper directory failed:", error);
      return NextResponse.json({ error: "The Inner Circle is temporarily unavailable." }, { status: 500 });
    }
  }
  try {
    const { data, error } = await getSupabaseAdmin().from("inner_circle_profiles")
      .select("user_id,discord_name,avatar_url,discord_roles,display_name,bio,last_seen_at")
      .order("discord_name");
    if (error) throw error;
    return NextResponse.json({ profiles: data ?? [], visibility: "member", currentUserId: user.id });
  } catch (error) {
    console.error("Inner Circle directory failed:", error);
    return NextResponse.json({ error: "The Inner Circle is temporarily unavailable." }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  const user = await current();
  if (!user.member || !user.id) return NextResponse.json({ error: "Verified Void membership is required." }, { status: 403 });
  let body: { display_name?: unknown; bio?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const displayName = typeof body.display_name === "string" ? body.display_name.trim() : "";
  const bio = typeof body.bio === "string" ? body.bio.trim() : "";
  if (displayName.length > 40 || bio.length > 240) return NextResponse.json({ error: "Display name must be 40 characters or fewer and bio 240 characters or fewer." }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin().from("inner_circle_profiles").update({ display_name: displayName || null, bio, updated_at: new Date().toISOString() }).eq("user_id", user.id);
    if (error) throw error;
    return NextResponse.json({ message: "Your profile has been updated." });
  } catch (error) {
    console.error("Inner Circle profile update failed:", error);
    return NextResponse.json({ error: "Your profile could not be updated." }, { status: 500 });
  }
}
