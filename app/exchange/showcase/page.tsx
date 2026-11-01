import ExchangeListings from "../listings";

export default function ExchangeShowcasePage() {
  return (
    <main className="exchange-showcase-page">
      <nav className="nav">
        <a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a>
        <a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a>
      </nav>
      <section className="showcase-hero">
        <p className="eyebrow">THE WORK OF OUR COMMUNITY</p>
        <h1>THE INFERNAL<br/><em>SHOWCASE</em></h1>
        <p>Discover the authors, makers, and independent creators within The Void. Every listing here has been reviewed and approved by the Void Reaper.</p>
        <a className="primary-link" href="/exchange">SUBMIT YOUR WORK <span>→</span></a>
      </section>
      <section className="showcase-content">
        <ExchangeListings />
      </section>
      <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
    </main>
  );
}
