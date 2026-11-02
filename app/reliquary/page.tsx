import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/auth-options";
import {getSupabaseAdmin} from "../../lib/supabase";
import Reliquary from "./reliquary";
export const dynamic="force-dynamic";
export default async function ReliquaryPage(){
 const session=await getServerSession(authOptions);const member=Boolean(session?.user?.guildMember);const isReaper=Boolean(member&&session?.user?.discordRoles?.includes("1495636529488461834"));let items:any[]=[];
 try{const q=getSupabaseAdmin().from("reliquary_submissions").select("id,user_id,discord_name,title,category,description,image_url,source_url,status,created_at").order("created_at",{ascending:false});const {data}=isReaper?await q:await q.eq("status","approved");items=data??[];}catch(e){console.error("Reliquary page load failed:",e);}
 return <main className="reliquary-page"><nav className="nav"><a className="brand" href="/"><img className="brand-crest" src="/void-crest.svg" alt=""/><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a></nav><section className="reliquary-hero"><p className="eyebrow">WHAT WE LEAVE WITHIN THE VOID</p><h1>THE <em>RELIQUARY</em></h1><p>A collection of memories, creations, and treasures left behind by the members of the Void.</p></section><Reliquary initialItems={items} member={member} isReaper={isReaper}/><footer><span className="footer-brand"><img src="/void-crest.svg" alt=""/> THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer></main>;
}