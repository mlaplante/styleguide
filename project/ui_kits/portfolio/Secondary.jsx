const { useState: _useState_svc } = React;

// Simple inline SVG monoline icons (Linea-style stand-ins: 1.5 stroke, 64x64)
const Icon = {
  shield: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M32 6 L52 14 V32 C52 46 42 54 32 58 C22 54 12 46 12 32 V14 Z" />
      <path d="M24 32 L30 38 L42 26" />
    </svg>
  ),
  cloud: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 44 C10 44 6 38 6 32 C6 24 14 20 20 22 C22 14 30 10 38 14 C46 10 56 18 54 28 C60 30 60 42 52 44 Z" />
    </svg>
  ),
  lock: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="14" y="28" width="36" height="28" rx="3" />
      <path d="M20 28 V20 C20 14 26 8 32 8 C38 8 44 14 44 20 V28" />
      <circle cx="32" cy="40" r="3" fill="currentColor" />
      <path d="M32 43 V49" />
    </svg>
  ),
  bulb: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 44 C18 40 16 32 18 26 C22 14 38 12 44 22 C48 28 46 38 40 44 V50 H24 Z" />
      <path d="M26 54 H38" />
      <path d="M28 58 H36" />
    </svg>
  ),
  target: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="32" cy="32" r="24" />
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  ),
  server: () => (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="10" width="44" height="14" rx="2" />
      <rect x="10" y="28" width="44" height="14" rx="2" />
      <rect x="10" y="46" width="44" height="10" rx="2" />
      <circle cx="18" cy="17" r="1.5" fill="currentColor" />
      <circle cx="18" cy="35" r="1.5" fill="currentColor" />
    </svg>
  ),
};

function Service({ icon, title, children }) {
  return (
    <div className="p-service">
      <div className="p-service-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function Services() {
  return (
    <section className="p-section p-bg-paper" id="services">
      <div className="p-container">
        <SectionHeader>consulting services</SectionHeader>
        <div className="p-service-grid">
          <Service icon={<Icon.shield />} title="Security Architecture">
            Assess your infrastructure, identify gaps, and design defense-in-depth strategies tailored to your risk profile and compliance requirements.
          </Service>
          <Service icon={<Icon.cloud />} title="Cloud Security Strategy">
            Build secure multi-cloud architectures across AWS, Azure, and GCP with zero-trust principles, least-privilege access, and continuous monitoring.
          </Service>
          <Service icon={<Icon.lock />} title="Compliance & Risk">
            Navigate SOC 2, ISO 27001, HIPAA, and PCI-DSS with practical frameworks that satisfy auditors without slowing your teams down.
          </Service>
          <Service icon={<Icon.bulb />} title="Engineering Leadership">
            Scale engineering organizations, establish DevSecOps practices, and build the security culture that keeps your company out of the headlines.
          </Service>
        </div>
        <div className="p-center">
          <a className="p-btn" href="#contact">Discuss Your Needs</a>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const items = [
    { date: 'January 2026 — Present', co: 'Proforma', role: 'SVP of Information Security and Operations', body: 'Leading information security strategy and operational excellence across the organization. Establishing and maintaining comprehensive security frameworks, driving compliance with industry standards, and fostering a culture of security awareness.', current: true },
    { date: 'April 2022 — January 2026', co: 'Proforma', role: 'Vice President of Technology', body: 'Led and managed technology teams while driving security and compliance innovation. Spearheaded strategic initiatives to enhance infrastructure security, implement robust compliance frameworks, and foster a culture of continuous improvement.' },
    { date: 'November 2021 — April 2022', co: 'Proforma', role: 'Director of Engineering', body: 'Responsible for the continued development of the company\u2019s multi-million dollar business management solution. Led development teams in greenfield and remediation work, monthly trainings, and 1-1 coaching.' },
    { date: 'July 2019 — November 2021', co: 'Proforma', role: 'Software Development Manager', body: 'Led development teams in executing greenfield and remediation tasks, with monthly trainings with team members and coaching of team leaders.' },
    { date: 'June 2015 — February 2019', co: 'FireEye', role: 'Senior Web Engineer', body: 'Created all Front End Development practices for FireEye\u2019s next-generation threat portal, FireEye Intelligence Portal, using React and Redux.' },
  ];
  return (
    <section className="p-section p-bg-flat" id="experience">
      <div className="p-container">
        <SectionHeader>my experience</SectionHeader>
        <ul className="p-timeline">
          {items.map((it, i) => (
            <li key={i} className={it.current ? 'current' : ''}>
              <div className="p-tl-date">{it.date}</div>
              <div className="p-tl-content">
                <h4>{it.co}</h4>
                <span className="p-tl-role">{it.role}</span>
                <p>{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MaterialInput({ label, type = 'text', textarea, value, onChange }) {
  const [focus, setFocus] = _useState_svc(false);
  const filled = !!value;
  const cls = `p-mi ${focus ? 'focus' : ''} ${filled ? 'filled' : ''}`;
  const props = {
    value, onChange, placeholder: ' ',
    onFocus: () => setFocus(true), onBlur: () => setFocus(false),
  };
  return (
    <div className="p-form-group">
      <div className={cls}>
        {textarea ? <textarea rows="3" {...props} /> : <input type={type} {...props} />}
        <label>{label}</label>
      </div>
    </div>
  );
}

function Contact() {
  const [name, setName] = _useState_svc('');
  const [email, setEmail] = _useState_svc('');
  const [msg, setMsg] = _useState_svc('');
  const [sent, setSent] = _useState_svc(false);
  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSent(true);
  };
  return (
    <section className="p-section p-bg-paper" id="contact">
      <div className="p-container">
        <SectionHeader>contact me</SectionHeader>
        {sent ? (
          <div className="p-alert">Message received. I'll be in touch shortly, {name}.</div>
        ) : (
          <form className="p-contact-form" onSubmit={submit}>
            <MaterialInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <MaterialInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <MaterialInput label="Message" textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button type="submit" className="p-btn">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="p-footer">
      <div className="p-container">
        <p className="p-copyright">Copyright © LaPlante Web Development 2006–2026.</p>
      </div>
    </footer>
  );
}

Object.assign(window, { Icon, Service, Services, Timeline, MaterialInput, Contact, Footer });
