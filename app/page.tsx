import CommunityPanel from "./community";

const features = [
  { number: "01", title: "The Archives", text: "Announcements, updates, and messages from the depths." },
  { number: "02", title: "The Inner Circle", text: "Member profiles, identity, and Discord-linked roles." },
  { number: "03", title: "The Gathering", text: "Community discussions and conversations." },
  { number: "04", title: "Rituals & Events", text: "Discover events, activities, and what comes next." },
  { number: "05", title: "The Gatehouse", text: "Applications, requests, and support tickets." },
  { number: "06", title: "Hidden Chambers", text: "Private spaces revealed according to your rank." }
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#" aria-label="The Void of Iniquity home"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a>
        <div className="nav-actions"><a className="nav-link" href="#realm">Explore the Realm <span>↗</span></a><a className="nav-link" href="#infernal-exchange">The Exchange <span>↗</span></a></div>
      </nav>

      <section className="hero">
        <div className="embers" aria-hidden="true" />
        <p className="eyebrow"><span /> A COMMUNITY BEYOND THE ORDINARY <span /></p>
        <h1>WELCOME TO<br /><em>THE VOID</em></h1>
        <p className="hero-copy">Where shadows gather, loyalty is forged, and the forgotten find their place.</p>
        <a className="primary-link" href="#realm">ENTER THE REALM <span>→</span></a>
        <div className="hero-bottom"><span>EST. IN THE SHADOWS</span><span>NO LIGHT. NO LIMITS.</span></div>
      </section>

      <section className="intro" id="realm">
        <p className="eyebrow">BEYOND THE SERVER</p>
        <h2>MORE THAN A<br /><em>PLACE TO GATHER.</em></h2>
        <p className="intro-copy">The Void is built on connection, character, and the people who give this realm its pulse. Find your place within it.</p>
      </section>

      <section className="features" aria-label="Community features">
        {features.map((feature) => (
          <article className="feature" key={feature.number}>
            <span className="feature-number">{feature.number}</span>
            <div><h3>{feature.title}</h3><p>{feature.text}</p></div>
            <span className="feature-arrow">↗</span>
          </article>
        ))}
      </section>

      <section className="exchange" id="infernal-exchange">
        <div className="exchange-heading">
          <p className="eyebrow">MADE BY THE MEMBERS OF THE VOID</p>
          <h2>THE INFERNAL<br /><em>EXCHANGE</em></h2>
          <p className="exchange-intro">A place for the creators among us. Discover the books, businesses, art, and creations born from the minds and hands of our own community.</p>
        </div>
        <div className="exchange-grid">
          <article className="exchange-card">
            <span className="exchange-kicker">FOR THE WORDSMITHS</span>
            <div className="exchange-art book-art" aria-hidden="true"><span>THE<br />AUTHOR'S<br /><b>CRYPT</b></span></div>
            <h3>The Author's Crypt</h3>
            <p>Meet the writers behind the words. Explore book covers, author profiles, genres, release news, and links to discover or purchase their work.</p>
            <ul><li>Author profiles & biographies</li><li>Book covers & featured releases</li><li>Reading and purchase links</li></ul>
          </article>
          <article className="exchange-card">
            <span className="exchange-kicker">FOR THE MAKERS & MERCHANTS</span>
            <div className="exchange-art market-art" aria-hidden="true"><span>THE<br /><b>ARTISAN'S</b><br />MARKET</span></div>
            <h3>The Artisan's Market</h3>
            <p>Give your small business a place to be seen. Showcase your products, photography, shop links, and the story behind what you create.</p>
            <ul><li>Business profiles & logos</li><li>Product photo galleries</li><li>Shop and social links</li></ul>
          </article>
        </div>
        <div className="exchange-footer">
          <p>YOUR CRAFT. YOUR STORY. YOUR PLACE IN THE VOID.</p>
          <span>Creator submissions will open once member profiles and staff review tools are ready.</span>
        </div>
      </section>

      <CommunityPanel />

      <section className="join">
        <p className="eyebrow">YOUR PLACE AWAITS</p>
        <h2>WILL YOU<br /><em>ANSWER THE CALL?</em></h2>
        <p>Step beyond the threshold. The Void is waiting.</p>
        <a className="primary-link" href="https://discord.com" target="_blank" rel="noreferrer">JOIN THE COMMUNITY <span>→</span></a>
      </section>

      <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
    </main>
  );
}