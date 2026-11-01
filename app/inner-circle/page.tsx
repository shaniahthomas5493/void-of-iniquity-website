import InnerCircle from "./inner-circle";
export const dynamic = "force-dynamic";
export default function InnerCirclePage() {
  return <main className="inner-circle-page">
    <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/">RETURN TO THE REALM ↗</a></nav>
    <section className="inner-circle-hero"><p className="eyebrow">IDENTITY. LOYALTY. BELONGING.</p><h1>THE INNER<br/><em>CIRCLE</em></h1><p>The faces behind the shadows. A directory of those who have claimed their place within the Void.</p></section>
    <section className="inner-circle-content"><InnerCircle /></section>
    <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
  </main>;
}
