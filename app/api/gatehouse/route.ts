import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REAPER = "1495636529488461834";
async function access() {
 const session = await getServerSession(authOptions);
 const member = Boolean(session?.user?.guildMember && session.user.id);
 return { session, member, reaper: Boolean(member && session?.user?.discordRoles?.includes(REAPER)) };
}
export async function GET() {
 const {session,member,reaper}=await access();
 if(!member)return NextResponse.json({error:"Verified Void membership is required."},{status:403});
 try {
  let query=getSupabaseAdmin().from("gatehouse_tickets").select("*").order("created_at",{ascending:false}).limit(100);
  if(!reaper)query=query.eq("user_id",session!.user!.id);
  const {data,error}=await query;
  if(error)throw error;
  return NextResponse.json({tickets:data??[]});
 } catch(error) { console.error("Gatehouse queue failed:",error); return NextResponse.json({error:"The Gatehouse is temporarily unavailable."},{status:500}); }
}
export async function POST(request:Request) {
 const {session,member}=await access();
 if(!member)return NextResponse.json({error:"Verified Void membership is required to submit a ticket."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const type=typeof body.ticket_type==="string"?body.ticket_type:"";
 const subject=typeof body.subject==="string"?body.subject.trim():"";
 const details=typeof body.details==="string"?body.details.trim():"";
 if(!["Application","Request","Support"].includes(type)||subject.length<3||subject.length>120||details.length<5||details.length>8000)
  return NextResponse.json({error:"Choose a category and check your subject and details."},{status:400});
 try {
  const {data,error}=await getSupabaseAdmin().from("gatehouse_tickets").insert({user_id:session!.user!.id,discord_name:session!.user!.name??"Void Member",ticket_type:type,subject,details}).select("id").single();
  if(error)throw error;
  return NextResponse.json({message:"Your submission has reached the Gatehouse.",id:data.id});
 } catch(error) { console.error("Gatehouse submission failed:",error); return NextResponse.json({error:"Your submission could not be saved."},{status:500}); }
}
export async function PATCH(request:Request) {
 const {reaper}=await access();
 if(!reaper)return NextResponse.json({error:"Void Reaper access is required."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=typeof body.id==="string"?body.id:"";
 const status=body.status;
 const staff_note=typeof body.staff_note==="string"?body.staff_note.trim().slice(0,2000):"";
 if(!/^[0-9a-f-]{36}$/i.test(id)||!["open","in_review","resolved","closed"].includes(String(status)))
  return NextResponse.json({error:"Choose a valid ticket and status."},{status:400});
 try {
  const {data,error}=await getSupabaseAdmin().from("gatehouse_tickets").update({status,staff_note,updated_at:new Date().toISOString()}).eq("id",id).select("id");
  if(error)throw error;
  if(!data?.length)return NextResponse.json({error:"Ticket not found."},{status:404});
  return NextResponse.json({message:"Ticket updated."});
 } catch(error) { console.error("Gatehouse update failed:",error); return NextResponse.json({error:"The ticket could not be updated."},{status:500}); }
}
export async function DELETE(request:Request) {
 const {reaper}=await access();
 if(!reaper)return NextResponse.json({error:"Void Reaper access is required."},{status:403});
 let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=typeof body.id==="string"?body.id:"";
 if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:"Choose a valid ticket."},{status:400});
 try {
  const {data,error}=await getSupabaseAdmin().from("gatehouse_tickets").delete().eq("id",id).select("id");
  if(error)throw error;
  if(!data?.length)return NextResponse.json({error:"Ticket not found."},{status:404});
  return NextResponse.json({message:"Ticket permanently deleted."});
 } catch(error) { console.error("Gatehouse deletion failed:",error); return NextResponse.json({error:"The ticket could not be deleted."},{status:500}); }
}
