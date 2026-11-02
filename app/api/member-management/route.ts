import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REAPER = "1495636529488461834";

async function isReaper() {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user?.guildMember && session.user.id && session.user.discordRoles?.includes(REAPER));
}

export async function GET() {
  if (!(await isReaper())) return NextResponse.json({ error: "Void Reaper access is required." }, { status: 403 });
  try {
    const supabase = getSupabaseAdmin();
    const [{ data: profiles, error: profileError }, { data: records, error: recordError }] = await Promise.all([
      supabase.from("inner_circle_profiles").select("user_id,discord_name,avatar_url,discord_roles,display_name,last_seen_at").order("discord_name"),
      supabase.from("member_management_records").select("*")
    ]);
    if (profileError) throw profileError;
    if (recordError) throw recordError;
    const byId = new Map((records ?? []).map((record) => [record.user_id, record]));
    return NextResponse.json({ members: (profiles ?? []).map((profile) => ({ ...profile, management: byId.get(profile.user_id) ?? null })) });
  } catch (error) {
    console.error("Member management load failed:", error);
    return NextResponse.json({ error: "Member records are temporarily unavailable." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.guildMember || !session.user.id || !session.user.discordRoles?.includes(REAPER)) {
    return NextResponse.json({ error: "Void Reaper access is required." }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const userId = typeof body.user_id === "string" ? body.user_id : "";
  const discordName = typeof body.discord_name === "string" ? body.discord_name.slice(0, 100) : "";
  const displayName = typeof body.display_name === "string" ? body.display_name.trim().slice(0, 80) : "";
  const rank = body.rank_label;
  const access = body.access_status;
  const standing = body.standing;
  const warnings = Number(body.warnings);
  const commendations = Number(body.commendations);
  const notes = typeof body.staff_notes === "string" ? body.staff_notes.trim() : "";
  if (!userId || !discordName || !["Unassigned", "Acolyte", "Ferryman", "Void Revenant", "Void Reaper"].includes(String(rank)) ||
      !["active", "restricted", "suspended", "departed"].includes(String(access)) ||
      !["good", "watch", "warning", "probation"].includes(String(standing)) ||
      !Number.isInteger(warnings) || warnings < 0 || warnings > 999 ||
      !Number.isInteger(commendations) || commendations < 0 || commendations > 999 || notes.length > 5000) {
    return NextResponse.json({ error: "Check the member details and try again." }, { status: 400 });
  }
  try {
    const { error } = await getSupabaseAdmin().from("member_management_records").upsert({
      user_id: userId, discord_name: discordName, display_name: displayName,
      rank_label: rank, access_status: access, standing, warnings, commendations,
      staff_notes: notes, updated_by: session.user.id, updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) throw error;
    return NextResponse.json({ message: "Member record saved." });
  } catch (error) {
    console.error("Member management save failed:", error);
    return NextResponse.json({ error: "The member record could not be saved." }, { status: 500 });
  }
}
