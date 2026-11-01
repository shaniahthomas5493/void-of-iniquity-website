import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/auth-options";
import { getSupabaseAdmin } from "../../../../lib/supabase";
export const runtime = "nodejs";
const ROLE = "1495636529488461834";
async function allowed() {
  const s = await getServerSession(authOptions);
  return Boolean(s?.user?.guildMember && s.user.discordRoles?.includes(ROLE));
}
export async function GET() {
  if (!(await allowed())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  try {
    const { data, error } = await getSupabaseAdmin().from("exchange_submissions").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ submissions: data ?? [] });
  } catch (error) {
    console.error("Exchange review queue failed:", error);
    return NextResponse.json({ error: "The review queue is temporarily unavailable." }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  if (!(await allowed())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  let body: { id?: unknown; status?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  const status = body.status;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(String(status)))
    return NextResponse.json({ error: "Choose a valid submission and review action." }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin().from("exchange_submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: status === "approved" ? "Submission approved." : "Submission rejected." });
  } catch (error) {
    console.error("Exchange review action failed:", error);
    return NextResponse.json({ error: "The review action could not be saved." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await allowed())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  let body: { id?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json({ error: "Choose a valid submission to delete." }, { status: 400 });
  try {
    const { data, error } = await getSupabaseAdmin().from("exchange_submissions").delete().eq("id", id).select("id");
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    return NextResponse.json({ message: "Submission permanently deleted." });
  } catch (error) {
    console.error("Exchange submission deletion failed:", error);
    return NextResponse.json({ error: "The submission could not be deleted." }, { status: 500 });
  }
}
