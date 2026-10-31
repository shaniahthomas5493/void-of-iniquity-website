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
        <a className="nav-link" href="#realm">Explore the Realm <span>↗</span></a>
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