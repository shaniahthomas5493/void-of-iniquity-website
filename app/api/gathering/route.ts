import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REAPER = "1495636529488461834";
async function access() {
 const session = await getServerSession(authOptions);
 return { session, member: Boolean(session?.user?.guildMember && session.user.id), reaper: Boolean(session?.user?.guildMember && session.user.discordRoles?.includes(REAPER)) };
}
export async function GET() {
 try {
  const { data, error } = await getSupabaseAdmin().from("gathering_topics").select("id,user_id,discord_name,title,category,content,created_at,gathering_replies(id,user_id,discord_name,content,created_at)").order("created_at",{ascending:false}).limit(100);
  if(error) throw error;
  return NextResponse.json({topics:data??[]});
 } catch(error) { console.error("Gathering feed failed:",error); return NextResponse.json({error:"The Gathering is temporarily unavailable."},{status:500}); }
}
export async function POST(request:Request) {
 const {session,member}=await access();
 if(!member) return NextResponse.json({error:"Verified Void membership is required to join the discussion."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const title=typeof body.title==="string"?body.title.trim():"";
 const content=typeof body.content==="string"?body.content.trim():"";
 const category=typeof body.category==="string"?body.category:"General";
 if(title.length<3||title.length>120||content.length<3||content.length>8000||!["General","Introductions","Questions","Books & Writing","Gaming","Events"].includes(category)) return NextResponse.json({error:"Check your title, category, and message."},{status:400});
 try{
  const {data,error}=await getSupabaseAdmin().from("gathering_topics").insert({user_id:session!.user!.id,discord_name:session!.user!.name??"Void Member",title,category,content}).select("id").single();
  if(error)throw error;
  return NextResponse.json({message:"Your discussion has been opened.",id:data.id});
 }catch(error){console.error("Gathering topic creation failed:",error);return NextResponse.json({error:"Your discussion could not be created."},{status:500});}
}
export async function PATCH(request:Request) {
 const {session,member}=await access();
 if(!member)return NextResponse.json({error:"Verified Void membership is required to reply."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const topicId=typeof body.topic_id==="string"?body.topic_id:"";
 const content=typeof body.content==="string"?body.content.trim():"";
 if(!/^[0-9a-f-]{36}$/i.test(topicId)||!content||content.length>4000)return NextResponse.json({error:"Enter a reply of 1–4,000 characters."},{status:400});
 try{
  const {error}=await getSupabaseAdmin().from("gathering_replies").insert({topic_id:topicId,user_id:session!.user!.id,discord_name:session!.user!.name??"Void Member",content});
  if(error)throw error;
  return NextResponse.json({message:"Your reply has been added."});
 }catch(error){console.error("Gathering reply failed:",error);return NextResponse.json({error:"Your reply could not be added."},{status:500});}
}
export async function DELETE(request:Request) {
 const {reaper}=await access();
 if(!reaper)return NextResponse.json({error:"Void Reaper access is required to moderate discussions."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=typeof body.id==="string"?body.id:"";
 const kind=body.kind;
 if(!/^[0-9a-f-]{36}$/i.test(id)||!["topic","reply"].includes(String(kind)))return NextResponse.json({error:"Choose a valid discussion item."},{status:400});
 try{
  const table=kind==="topic"?"gathering_topics":"gathering_replies";
  const {data,error}=await getSupabaseAdmin().from(table).delete().eq("id",id).select("id");
  if(error)throw error;
  if(!data?.length)return NextResponse.json({error:"Discussion item not found."},{status:404});
  return NextResponse.json({message:"Discussion item removed."});
 }catch(error){console.error("Gathering moderation failed:",error);return NextResponse.json({error:"The item could not be removed."},{status:500});}
}