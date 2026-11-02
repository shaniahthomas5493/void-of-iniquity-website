import { getSupabaseAdmin } from "../../lib/supabase";
export const dynamic = "force-dynamic";
export default async function ArchivesPage() {
 let posts: any[] = [];
 let unavailable = false;
 try {
  const { data, error } = await getSupabaseAdmin().from("archive_posts").select("id,title,category,excerpt,content,author_name,created_at").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  posts = data ?? [];
 } catch { unavailable = true; }
 return <main className="archives-page">
  <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><div className="nav-actions"><a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a></div></nav>
  <section className="archives-hero"><p className="eyebrow">ANNOUNCEMENTS · UPDATES · DISPATCHES</p><h1>THE <em>ARCHIVES</em></h1><p>Announcements, updates, and messages from the depths.</p><span className="archives-seal">PRESERVED WITHIN THE VOID</span></section>
  <section className="archives-content">
   <div className="archives-heading"><p className="eyebrow">RECORDED FROM THE DEPTHS</p><h2>THE LATEST <em>RECORDS</em></h2><p>Important words from the realm, gathered in one place.</p></div>
   {unavailable ? <p className="archives-empty">The archive shelves are temporarily unavailable. Return soon.</p> : posts.length ? <div className="archive-list">{posts.map(post => <article className="archive-entry" key={post.id}><div className="archive-meta"><span>{post.category}</span><time>{new Date(post.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</time></div><h3>{post.title}</h3>{post.excerpt ? <p className="archive-excerpt">{post.excerpt}</p> : null}<div className="archive-body">{post.content.split("\n").map((line:string,i:number)=><p key={i}>{line || " "}</p>)}</div><span className="archive-author">— {post.author_name || "The Void"}</span></article>)}</div> : <div className="archives-empty"><span>NO RECORDS HAVE BEEN SEALED</span><p>There are no announcements to display just yet. The next message from the depths will appear here.</p></div>}
  </section>
  <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
 </main>;
}
