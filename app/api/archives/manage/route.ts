import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/auth-options";
import { getSupabaseAdmin } from "../../../../lib/supabase";
export const runtime = "nodejs";
export async function GET() {
 const session = await getServerSession(authOptions);
 if (!session?.user?.guildMember || !session.user.discordRoles?.includes("1495636529488461834")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
 try {
  const { data, error } = await getSupabaseAdmin().from("archive_posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return NextResponse.json({ posts: data ?? [] });
 } catch (error) {
  console.error("Archives management feed failed:", error);
  return NextResponse.json({ error: "The Archives could not be loaded." }, { status: 500 });
 }
}
