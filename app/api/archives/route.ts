import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REAPER = "1495636529488461834";
async function isReaper() {
 const session = await getServerSession(authOptions);
 return Boolean(session?.user?.guildMember && session.user.discordRoles?.includes(REAPER));
}
export async function GET() {
 try {
  const { data, error } = await getSupabaseAdmin().from("archive_posts").select("id,title,category,excerpt,content,author_name,created_at").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return NextResponse.json({ posts: data ?? [] });
 } catch (error) {
  console.error("Archives feed failed:", error);
  return NextResponse.json({ error: "The Archives are temporarily unavailable." }, { status: 500 });
 }
}
export async function POST(request: Request) {
 if (!(await isReaper())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
 let body: Record<string, unknown>;
 try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
 const title = typeof body.title === "string" ? body.title.trim() : "";
 const category = typeof body.category === "string" ? body.category.trim() : "Announcement";
 const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
 const content = typeof body.content === "string" ? body.content.trim() : "";
 const published = body.published === true;
 if (!title || title.length > 120 || !content || content.length > 12000 || excerpt.length > 300 || category.length > 40)
  return NextResponse.json({ error: "Check the title, category, excerpt, and message lengths." }, { status: 400 });
 try {
  const { error } = await getSupabaseAdmin().from("archive_posts").insert({ title, category, excerpt, content, published, author_name: "The Void" });
  if (error) throw error;
  return NextResponse.json({ message: published ? "Message published to the Archives." : "Draft saved." });
 } catch (error) {
  console.error("Archives post creation failed:", error);
  return NextResponse.json({ error: "The message could not be saved." }, { status: 500 });
 }
}
export async function PATCH(request: Request) {
 if (!(await isReaper())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
 let body: Record<string, unknown>;
 try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
 const id = typeof body.id === "string" ? body.id : "";
 const published = body.published;
 if (!/^[0-9a-f-]{36}$/i.test(id) || typeof published !== "boolean") return NextResponse.json({ error: "Choose a valid post and status." }, { status: 400 });
 try {
  const { data, error } = await getSupabaseAdmin().from("archive_posts").update({ published, updated_at: new Date().toISOString() }).eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ message: published ? "Post published." : "Post moved to drafts." });
 } catch (error) {
  console.error("Archives publishing action failed:", error);
  return NextResponse.json({ error: "The post could not be updated." }, { status: 500 });
 }
}
export async function DELETE(request: Request) {
 if (!(await isReaper())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
 let body: { id?: unknown };
 try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
 const id = typeof body.id === "string" ? body.id : "";
 if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Choose a valid post." }, { status: 400 });
 try {
  const { data, error } = await getSupabaseAdmin().from("archive_posts").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ message: "Post deleted." });
 } catch (error) {
  console.error("Archives deletion failed:", error);
  return NextResponse.json({ error: "The post could not be deleted." }, { status: 500 });
 }
}
