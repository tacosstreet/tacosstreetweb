"use client";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const socials = [
  {
    href: "https://www.instagram.com/tacosstreet.es/",
    icon: FaInstagram,
    name: "Instagram",
    handle: "@tacosstreet.es",
    cta: "Seguir",
    gradient: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
  },
  {
    href: "https://www.tiktok.com/@tacosstreet.es",
    icon: FaTiktok,
    name: "TikTok",
    handle: "@tacosstreet.es",
    cta: "Seguir",
    gradient: "linear-gradient(135deg, #00f2ea, #ff0050)",
  },
];

export default function SocialSection() {
  return (
    <section className="social-section">
      <p className="sec-ey">Siguenos</p>
      <h2 className="sec-title">
        Nuestras redes
      </h2>
      <div className="social-grid">
        {socials.map((s) => (
          <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-icon-wrap" style={{ background: s.gradient }}>
              <s.icon size={32} color="#fff" />
            </div>
            <span className="social-name">{s.name}</span>
            <span className="social-handle">{s.handle}</span>
            <span className="social-follow">{s.cta} &rarr;</span>
          </a>
        ))}
      </div>
    </section>
  );
}
