import Link from "next/link";
import { Briefcase, Linkedin, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const footerSections = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Browse Jobs", href: "/job" },
      { label: "Browse Internships", href: "/internship" },
      { label: "Applications", href: "/userapplication" },
      { label: "Saved Jobs", href: "/profile" },
      { label: "Career Resources", href: "/" },
      { label: "Help Center", href: "/" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a Job", href: "/postjob" },
      { label: "Post an Internship", href: "/postinternship" },
      { label: "Browse Candidates", href: "/adminpanel" },
      { label: "Pricing", href: "/pricing" },
      { label: "Employer Resources", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/" },
      { label: "Contact Us", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-neutral-900)", color: "#fff" }}>
      {/* Main Footer Content */}
      <div style={{ maxWidth: "var(--container-2xl)", margin: "0 auto", padding: "56px var(--page-padding-desktop) 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }} className="footer-grid">

          {/* Brand Column */}
          <div style={{ gridColumn: "1 / 2" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36,
                background: "var(--color-brand-900)",
                borderRadius: "var(--radius-sm)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Briefcase size={18} color="#fff" />
              </div>
              <div>
                <span style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "#fff", lineHeight: 1 }}>
                  Intern<span style={{ color: "var(--color-brand-400)" }}>Area</span>
                </span>
                <div style={{ fontSize: 10, color: "var(--color-neutral-500)", fontWeight: 500, letterSpacing: "0.04em" }}>
                  Find. Learn. Grow.
                </div>
              </div>
            </Link>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)", lineHeight: 1.7, maxWidth: 220 }}>
              India's trusted platform for jobs and internships. Start your journey today.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={label}
                  style={{
                    width: 34, height: 34,
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-neutral-400)",
                    transition: "all 0.15s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-brand-900)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 style={{
                fontSize: "var(--text-xs)", fontWeight: 600,
                color: "var(--color-neutral-400)",
                textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 16,
              }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "var(--text-sm)", color: "var(--color-neutral-400)",
                        textDecoration: "none", transition: "color 0.15s ease",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{
          marginTop: 48,
          padding: "28px 32px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Mail size={16} color="var(--color-brand-400)" />
              <span style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "#fff" }}>Subscribe to our newsletter</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", margin: 0 }}>
              Get the latest job opportunities and career tips in your inbox.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
                color: "#fff",
                fontSize: "var(--text-sm)",
                outline: "none",
                width: 220,
              }}
            />
            <button className="btn btn-accent btn-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-600)", margin: 0 }}>
            © 2024 InternArea. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(item => (
              <Link
                key={item}
                href="/"
                style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-600)", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-300)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-600)"; }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}