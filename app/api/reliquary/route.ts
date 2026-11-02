import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REAPER = "1495636529488461834";
const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0,max) : "";
const isUrl = (v: string) => { try { return new URL(v).protocol === "https:"; } catch { return false; } };
async function session(){ return getServerSession(authOptions); }
export async function GET(){
 const s=await session(); const admin=Boolean(s?.user?.guildMember && s.user.discordRoles?.includes(REAPER));
 try { const q=getSupabaseAdmin().from("reliquary_submissions").select("id,user_id,discord_name,title,category,description,image_url,source_url,status,created_at").order("created_at",{ascending:false}); const {data,error}=admin?await q:await q.eq("status","approved"); if(error)throw error; return NextResponse.json({items:data??[]}); }
 catch(e){console.error("Reliquary load failed:",e);return NextResponse.json({error:"The Reliquary is temporarily unavailable."},{status:500});}
}
export async function POST(req:Request){
 const s=await session();if(!s?.user?.id||!s.user.guildMember)return NextResponse.json({error:"A verified Void member account is required."},{status:403});
 let b:Record<string,unknown>;try{b=await req.json();}catch{return NextResponse.json({error:"Invalid submission."},{status:400});}
 const title=clean(b.title,100),category=clean(b.category,40),description=clean(b.description,1000),image=clean(b.image_url,1000),source=clean(b.source_url,1000);
 if(title.length<2||!["Artwork","Photography","Tattoo","Gaming","Writing","Music","Digital Creation","Other"].includes(category)||!isUrl(image)||(source&&!isUrl(source)))return NextResponse.json({error:"Add a title, category, valid HTTPS image URL, and optional HTTPS source link."},{status:400});
 try{const {error}=await getSupabaseAdmin().from("reliquary_submissions").insert({user_id:s.user.id,discord_name:s.user.name??"Void Member",title,category,description,image_url:image,source_url:source||null,status:"pending"});if(error)throw error;return NextResponse.json({message:"Your creation has entered the Reaper review queue."},{status:201});}
 catch(e){console.error("Reliquary submission failed:",e);return NextResponse.json({error:"Your creation could not be submitted."},{status:500});}
}
export async function PATCH(req:Request){
 const s=await session();if(!s?.user?.guildMember||!s.user.discordRoles?.includes(REAPER))return NextResponse.json({error:"Forbidden."},{status:403});
 let b:Record<string,unknown>;try{b=await req.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=clean(b.id,36),status=clean(b.status,20);if(!/^[0-9a-f-]{36}$/i.test(id)||!["approved","rejected"].includes(status))return NextResponse.json({error:"Choose a valid submission and status."},{status:400});
 try{const {error}=await getSupabaseAdmin().from("reliquary_submissions").update({status,updated_at:new Date().toISOString()}).eq("id",id);if(error)throw error;return NextResponse.json({message:"Submission reviewed."});}
 catch(e){console.error("Reliquary moderation failed:",e);return NextResponse.json({error:"Could not update submission."},{status:500});}
}
export async function DELETE(req:Request){
 const s=await session();if(!s?.user?.guildMember||!s.user.discordRoles?.includes(REAPER))return NextResponse.json({error:"Forbidden."},{status:403});
 let b:Record<string,unknown>;try{b=await req.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=clean(b.id,36);if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:"Invalid submission."},{status:400});
 try{const {error}=await getSupabaseAdmin().from("reliquary_submissions").delete().eq("id",id);if(error)throw error;return NextResponse.json({message:"Submission deleted."});}
 catch(e){console.error("Reliquary deletion failed:",e);return NextResponse.json({error:"Could not delete submission."},{status:500});}
}