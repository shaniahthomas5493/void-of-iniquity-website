import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/auth-options";

const VOID_REAPER_ROLE = "1495636529488461834";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.guildMember) redirect("/");
  if (!session.user.discordRoles?.includes(VOID_REAPER_ROLE)) redirect("/");

  return (
    <main className="admin-page">
      <nav className="nav">
        <a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a>
        <a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a>
      </nav>

      <section className="admin-hero">
        <p className="eyebrow"><span /> THE INNER SANCTUM <span /></p>
        <h1>VOID <em>REAPER</em></h1>
        <p className="admin-welcome">Welcome, {session.user.name ?? "Void Reaper"}. Your highest-level access has been verified.</p>
        <span className="admin-access">VOID REAPER ACCESS CONFIRMED</span>
      </section>

      <section className="admin-content">
        <div className="admin-section-heading">
          <p className="eyebrow">THE CONTROL ROOM</p>
          <h2>REALM <em>OVERVIEW</em></h2>
          <p>Administrative areas for the community. Tools will become available as their secure workflows are connected.</p>
        </div>

        <div className="admin-grid">
          <article className="admin-card">
            <span className="admin-card-number">01 / COMMUNITY</span>
            <h3>Member Management</h3>
            <p>Plan and oversee member access, role assignments, and community standing.</p>
            <span className="admin-status">MANAGEMENT TOOLS NOT CONNECTED</span>
          </article>
          <article className="admin-card">
            <span className="admin-card-number">02 / THE EXCHANGE</span>
            <h3>Creator Submissions</h3>
            <p>Review author and artisan applications before their profiles appear in the Infernal Exchange.</p>
            <span className="admin-status">REVIEW WORKFLOW NOT CONNECTED</span>
          </article>
          <article className="admin-card">
            <span className="admin-card-number">03 / THE ARCHIVES</span>
            <h3>Website Content</h3>
            <p>Prepare announcements, event updates, and featured community content.</p>
            <span className="admin-status">CONTENT EDITOR NOT CONNECTED</span>
          </article>
          <article className="admin-card">
            <span className="admin-card-number">04 / SECURITY</span>
            <h3>Access & Permissions</h3>
            <p>This dashboard is restricted to verified server members holding the Void Reaper role.</p>
            <span className="admin-status admin-status-live">SERVER ROLE CHECK ACTIVE</span>
          </article>
        </div>

        <div className="admin-security">
          <strong>SECURITY NOTE</strong>
          <p>Dashboard access is checked on the server using your verified Discord session and role. A visible link or browser-side change cannot grant administrative access.</p>
        </div>
      </section>
      <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
    </main>
  );
}
