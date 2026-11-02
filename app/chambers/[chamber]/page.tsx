import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../api/auth/auth-options";

export const dynamic = "force-dynamic";

const chambers: Record<string,{title:string;rank:number;role:string;intro:string;message:string}> = {
  acolytes: { title: "THE ACOLYTES' SANCTUM", rank: 1, role: "1515430083601502369", intro: "THE FIRST THRESHOLD", message: "Every oath begins somewhere. This sanctum is reserved for those who have taken their first place within the Void." },
  ferryman: { title: "THE FERRYMAN'S CROSSING", rank: 2, role: "1524785126163091526", intro: "KEEPER OF THE PASSAGE", message: "You have crossed beyond the first threshold. Here, the Ferrymen gather, guide, and keep watch over the passage." },
  revenants: { title: "THE REVENANT HALL", rank: 3, role: "1495636936075903027", intro: "KEEPERS OF THE VOID", message: "The Revenants stand where loyalty becomes responsibility. This hall is reserved for those trusted to uphold the realm." },
  reaper: { title: "THE REAPER'S DOMINION", rank: 4, role: "1495636529488461834", intro: "THE INNERMOST SANCTUM", message: "The final door opens only to the Void Reapers. From this place, the realm is shaped and its future guarded." }
};

const roleRank = (roles:string[]) => roles.includes("1495636529488461834") ? 4 : roles.includes("1495636936075903027") ? 3 : roles.includes("1524785126163091526") ? 2 : roles.includes("1515430083601502369") ? 1 : 0;

export default async function ChamberPage({params}:{params:Promise<{chamber:string}>}) {
  const {chamber:key}=await params;
  const room=chambers[key];
  if(!room)notFound();
  const session=await getServerSession(authOptions);
  if(!session?.user?.guildMember)redirect("/chambers");
  if(roleRank(session.user.discordRoles??[])<room.rank)redirect("/chambers");
  return <main className="chambers-page">
    <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/chambers">ALL CHAMBERS ↗</a></nav>
    <section className="chamber-room"><p className="eyebrow">{room.intro}</p><h1>{room.title}</h1><p>{room.message}</p><div className="chamber-seal">✦</div><a className="primary-link" href="/chambers">RETURN TO HIDDEN CHAMBERS →</a></section>
    <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
  </main>;
}
