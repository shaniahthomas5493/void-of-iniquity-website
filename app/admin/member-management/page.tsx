import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/auth-options";
import MemberManagement from "./member-management";

const REAPER = "1495636529488461834";

export const dynamic = "force-dynamic";

export default async function MemberManagementPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.guildMember || !session.user.discordRoles?.includes(REAPER)) redirect("/");
  return <main className="admin-page">
    <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/admin">RETURN TO CONTROL ROOM ↗</a></nav>
    <MemberManagement />
    <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
  </main>;
}
