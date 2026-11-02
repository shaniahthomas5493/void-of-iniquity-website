import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/auth-options";
import { getSupabaseAdmin } from "../../../lib/supabase";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const REAPER="1495636529488461834";
async function access(){const session=await getServerSession(authOptions);const member=Boolean(session?.user?.guildMember&&session.user.id);return {session,member,reaper:Boolean(member&&session?.user?.discordRoles?.includes(REAPER))};}
export async function GET(){
 const {reaper}=await access();
 try{
  const db=getSupabaseAdmin();
  const [{data:events,error:eventsError},{data:suggestions,error:suggestionsError}]=await Promise.all([
   db.from("ritual_events").select("id,title,category,description,starts_at,ends_at,location,discord_url,status,created_at").in("status",["published","cancelled"]).order("starts_at",{ascending:true}),
   reaper?db.from("ritual_suggestions").select("id,title,details,preferred_date,status,discord_name,created_at").eq("status","pending").order("created_at",{ascending:false}).limit(30):Promise.resolve({data:[],error:null})
  ]);
  if(eventsError)throw eventsError;if(suggestionsError)throw suggestionsError;
  const {data:rsvps,error:rsvpError}=await db.from("ritual_rsvps").select("event_id,user_id,discord_name");
  if(rsvpError)throw rsvpError;
  return NextResponse.json({events:events??[],suggestions:suggestions??[],rsvps:rsvps??[]});
 }catch(e){console.error("Rituals feed failed:",e);return NextResponse.json({error:"Rituals & Events are temporarily unavailable."},{status:500});}
}
export async function POST(request:Request){
 const {session,member,reaper}=await access();let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const action=body.action;
 if(action==="suggest"){
  if(!member)return NextResponse.json({error:"Sign in with a verified Discord account to suggest an event."},{status:403});
  const title=typeof body.title==="string"?body.title.trim():"";const details=typeof body.details==="string"?body.details.trim():"";const preferred_date=typeof body.preferred_date==="string"&&body.preferred_date?body.preferred_date:null;
  if(title.length<3||title.length>120||details.length<3||details.length>4000)return NextResponse.json({error:"Check the suggestion title and details."},{status:400});
  try{const {error}=await getSupabaseAdmin().from("ritual_suggestions").insert({user_id:session!.user!.id,discord_name:session!.user!.name??"Void Member",title,details,preferred_date});if(error)throw error;return NextResponse.json({message:"Your event suggestion has been sent to the Reapers."});}
  catch(e){console.error(e);return NextResponse.json({error:"Your suggestion could not be saved."},{status:500});}
 }
 if(action==="create"){
  if(!reaper)return NextResponse.json({error:"Void Reaper access is required to publish events."},{status:403});
  const title=typeof body.title==="string"?body.title.trim():"";const description=typeof body.description==="string"?body.description.trim():"";const category=typeof body.category==="string"?body.category:"Community";const starts_at=typeof body.starts_at==="string"?body.starts_at:"";const ends_at=typeof body.ends_at==="string"&&body.ends_at?body.ends_at:null;const location=typeof body.location==="string"?body.location.trim():"The Void";const discord_url=typeof body.discord_url==="string"?body.discord_url.trim():"";const status=body.status==="draft"?"draft":"published";
  if(title.length<3||title.length>120||description.length<3||description.length>8000||!starts_at||Number.isNaN(Date.parse(starts_at))||(ends_at&&Number.isNaN(Date.parse(ends_at)))||!["Community","Gaming","Movie Night","Writing","Voice Chat","Special Event"].includes(category))return NextResponse.json({error:"Check the event details, category, and date."},{status:400});
  if(discord_url&&!/^https:\/\//i.test(discord_url))return NextResponse.json({error:"Discord link must begin with https://."},{status:400});
  try{const {error}=await getSupabaseAdmin().from("ritual_events").insert({title,description,category,starts_at,ends_at,location:location||"The Void",discord_url:discord_url||null,status,created_by:session!.user!.id});if(error)throw error;return NextResponse.json({message:status==="draft"?"Event draft saved.":"Event added to the calendar."});}
  catch(e){console.error(e);return NextResponse.json({error:"The event could not be saved."},{status:500});}
 }
 return NextResponse.json({error:"Unknown action."},{status:400});
}
export async function PATCH(request:Request){
 const {session,member,reaper}=await access();let body:Record<string,unknown>;
 try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=typeof body.id==="string"?body.id:"";
 if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:"Choose a valid item."},{status:400});
 try{
  if(body.action==="rsvp"){
   if(!member)return NextResponse.json({error:"Verified Void membership is required to RSVP."},{status:403});
   const {data:existing,error:lookupError}=await getSupabaseAdmin().from("ritual_rsvps").select("id").eq("event_id",id).eq("user_id",session!.user!.id).maybeSingle();if(lookupError)throw lookupError;
   if(existing){const {error}=await getSupabaseAdmin().from("ritual_rsvps").delete().eq("id",existing.id);if(error)throw error;return NextResponse.json({message:"Your RSVP has been removed.",going:false});}
   const {error}=await getSupabaseAdmin().from("ritual_rsvps").insert({event_id:id,user_id:session!.user!.id,discord_name:session!.user!.name??"Void Member"});if(error)throw error;return NextResponse.json({message:"You're on the attendee list.",going:true});
  }
  if(!reaper)return NextResponse.json({error:"Void Reaper access is required."},{status:403});
  if(body.action==="event-status"&&["published","draft","cancelled"].includes(String(body.status))){
   const {data,error}=await getSupabaseAdmin().from("ritual_events").update({status:body.status,updated_at:new Date().toISOString()}).eq("id",id).select("id");if(error)throw error;if(!data?.length)return NextResponse.json({error:"Event not found."},{status:404});return NextResponse.json({message:"Event status updated."});
  }
  if(body.action==="suggestion-status"&&["pending","considered","scheduled","declined"].includes(String(body.status))){
   const {data,error}=await getSupabaseAdmin().from("ritual_suggestions").update({status:body.status}).eq("id",id).select("id");if(error)throw error;if(!data?.length)return NextResponse.json({error:"Suggestion not found."},{status:404});return NextResponse.json({message:"Suggestion updated."});
  }
  return NextResponse.json({error:"Unknown action."},{status:400});
 }catch(e){console.error("Rituals update failed:",e);return NextResponse.json({error:"That action could not be completed."},{status:500});}
}
export async function DELETE(request:Request){
 const {reaper}=await access();if(!reaper)return NextResponse.json({error:"Void Reaper access is required."},{status:403});
 let body:Record<string,unknown>;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 const id=typeof body.id==="string"?body.id:"";const kind=body.kind;
 if(!/^[0-9a-f-]{36}$/i.test(id)||!["event","suggestion"].includes(String(kind)))return NextResponse.json({error:"Choose a valid item."},{status:400});
 try{const table=kind==="event"?"ritual_events":"ritual_suggestions";const {data,error}=await getSupabaseAdmin().from(table).delete().eq("id",id).select("id");if(error)throw error;if(!data?.length)return NextResponse.json({error:"Item not found."},{status:404});return NextResponse.json({message:"Item deleted."});}
 catch(e){console.error(e);return NextResponse.json({error:"Item could not be deleted."},{status:500});}
}
