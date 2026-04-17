const { useState, useEffect } = React;

function Nav({ dark, onToggleDark, open, onToggle }) {
  const items = ['Home', 'About', 'Services', 'Skills', 'Experience', 'Contact', 'Blog', 'Uses'];
  return (
    <nav className={`p-nav ${open ? 'open' : ''}`}>
      <div className="p-container p-nav-inner">
        <button className="p-menu-btn" onClick={onToggle} aria-label="Toggle menu">
          <span className="p-lines">
            <span className={`p-l p-l1 ${open ? 'x' : ''}`}></span>
            <span className={`p-l p-l2 ${open ? 'x' : ''}`}></span>
            <span className={`p-l p-l3 ${open ? 'x' : ''}`}></span>
          </span>
        </button>
        <button className="p-dark-toggle" onClick={onToggleDark} aria-label="Toggle dark mode">
          {dark ? '🌙' : '☀️'}
        </button>
        <div className="p-menu">
          <ul>
            {items.map((it, i) => (
              <li key={it} style={{ transitionDelay: open ? `${0.1 + i * 0.05}s` : '0s' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); onToggle(); }}>{it}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="p-hero" id="home">
      <div className="p-container">
        <div className="p-portrait" role="img" aria-label="Michael LaPlante — placeholder portrait">
          <div className="p-portrait-inner">
            <img src="../../assets/laplante-logo-white.png" alt="La Plante Web Development" />
            <span className="p-portrait-note">portrait placeholder</span>
          </div>
        </div>
        <h1 className="p-hero-name">I am <strong>Michael<br/>La Plante</strong></h1>
        <p className="p-hero-tagline">SVP of Information Security and Operations</p>
        <div className="p-hero-cta">
          <a className="p-btn" href="#contact">Schedule a Consultation</a>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ children }) {
  return (
    <div className="p-section-header">
      <h2 className="p-eyebrow">{children}</h2>
    </div>
  );
}

function About() {
  return (
    <section className="p-section" id="about">
      <div className="p-container">
        <SectionHeader>about me</SectionHeader>
        <p className="p-about-lead">
          I'm an accomplished technology executive with comprehensive expertise in cybersecurity strategy, enterprise operations, and innovative software engineering.
        </p>
        <p className="p-about-body">
          With over 15 years of distinguished professional experience, I spearhead mission-critical technology initiatives as SVP of Information Security and Operations, delivering measurable impact across complex enterprise environments. My career trajectory showcases proven success in software engineering excellence, advanced security architecture, strategic team leadership, and operational transformation.
        </p>
        <p className="p-about-body">
          I architect and implement secure, scalable enterprise-grade technology solutions while cultivating high-performing teams that consistently exceed objectives and drive meaningful organizational change.
        </p>
        <ul className="p-social">
          <li><a>LinkedIn</a></li>
          <li><a>Facebook</a></li>
          <li><a>Twitter</a></li>
          <li><a>Github</a></li>
        </ul>
      </div>
    </section>
  );
}

function Funfacts() {
  const data = [
    { n: '$800M', l: 'Company secured' },
    { n: '15+', l: 'Years in enterprise security' },
    { n: '70+', l: 'Speaking engagements' },
    { n: '500+', l: 'Clients served' },
  ];
  return (
    <section className="p-section p-bg-flat" id="funfacts">
      <div className="p-container">
        <SectionHeader>by the numbers</SectionHeader>
        <div className="p-funfacts">
          {data.map((d) => (
            <div className="p-funfact" key={d.l}>
              <strong>{d.n}</strong>
              <span>{d.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, SectionHeader, About, Funfacts });
