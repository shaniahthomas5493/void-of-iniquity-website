import Gathering from "./gathering";
export const dynamic = "force-dynamic";
export default function GatheringPage(){
 return <main className="gathering-page">
  <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><div className="nav-actions"><a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a><a className="nav-link" href="https://discord.com/channels/1495621533232791552" target="_blank" rel="noreferrer">OPEN DISCORD <span>↗</span></a></div></nav>
  <section className="gathering-hero"><p className="eyebrow">WHERE VOICES MEET IN THE DARK</p><h1>THE <em>GATHERING</em></h1><p>Community discussions and conversations.</p><a className="primary-link" href="https://discord.com/channels/1495621533232791552" target="_blank" rel="noreferrer">ENTER THE DISCORD SERVER <span>↗</span></a></section>
  <Gathering/>
  <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
 </main>;
}