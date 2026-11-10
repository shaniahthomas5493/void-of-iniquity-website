import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth-options";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ranks = [{ key: "reaper", name: "THE REAPER DOMINION", rank: "VOID REAPER", role: "1495636529488461834", description: "The sole hidden chamber, reserved for Void Reapers.", href: "/chambers/reaper" }];

export default async function ChambersPage() {
  const session = await getServerSession(authOptions);
  const member = Boolean(session?.user?.guildMember);
  const roles = session?.user?.discordRoles ?? [];
  const highest = roles.includes("1495636529488461834") ? 1 : 0;
  return <main className="chambers-page">
    <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/">RETURN TO THE REALM ↗</a></nav>
    <section className="chambers-hero"><p className="eyebrow">ACCESS IS EARNED. SECRETS ARE KEPT.</p><h1>HIDDEN <em>CHAMBERS</em></h1><p>One private chamber, reserved exclusively for Void Reapers.</p></section>
    <section className="chambers-content">
      {!session ? <div className="chambers-gate"><h2>THE DOORS ARE <em>SEALED</em></h2><p>Connect your Discord account to verify your rank and reveal the chambers you may enter.</p><a className="primary-link" href="/api/auth/signin/discord?callbackUrl=%2Fchambers">SIGN IN WITH DISCORD →</a></div> : !member || highest === 0 ? <div className="chambers-gate"><h2>NO RANK <em>RECOGNIZED</em></h2><p>Your account is signed in, but no recognized Void rank was found. Confirm your server role, then sign out and back in to refresh your access.</p></div> : null}
      {highest > 0 && <><div className="chambers-intro"><p className="eyebrow">YOUR ACCESS</p><h2>{session?.user?.name ?? "VOID MEMBER"}</h2><p>Your Reaper rank grants access to the sole hidden chamber.</p></div><div className="chambers-grid">{ranks.filter((_,i)=>i<highest).reverse().map((room,i)=><a className="chamber-card" href={room.href} key={room.key}><span className="chamber-number">0{i+1} / {room.rank}</span><h3>{room.name}</h3><p>{room.description}</p><span className="chamber-enter">ENTER CHAMBER ↗</span></a>)}</div></>}
    </section>
    <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
  </main>;
}
