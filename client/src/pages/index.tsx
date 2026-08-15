import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import {
  Search, MapPin, ArrowRight, Building2, GraduationCap,
  Briefcase, Users, Shield, Zap, TrendingUp, ChevronRight,
  Code2, Palette, BarChart2, Megaphone, IndianRupee, Grid3x3,
  Sparkles,
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import JobCard, { JobCardProps } from "@/component/JobCard";

// ─── CATEGORY CONFIG ────────────────────────────────────────────────
const CATEGORY_CONFIG = [
  { label: "Engineering",  icon: <Code2 size={20} />,     key: "Engineering" },
  { label: "Design",       icon: <Palette size={20} />,   key: "Design" },
  { label: "Data Science", icon: <BarChart2 size={20} />, key: "Data Science" },
  { label: "Marketing",    icon: <Megaphone size={20} />, key: "Marketing" },
  { label: "Finance",      icon: <IndianRupee size={20} />, key: "Finance" },
  { label: "View All",     icon: <Grid3x3 size={20} />,   key: "" },
];

// ─── TOP COMPANIES (static) ─────────────────────────────────────────
const TOP_COMPANIES = [
  { name: "Google",    color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon",    color: "#FF9900" },
  { name: "Swiggy",    color: "#FC8019" },
  { name: "Zepto",     color: "#7B2FBE" },
  { name: "Adobe",     color: "#FF0000" },
  { name: "Deloitte",  color: "#86BC25" },
];

// ─── STAT COUNTER (count-up on mount) ──────────────────────────────
function StatCounter({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--color-brand-100)", margin: "0 auto 12px" }}>
        <span style={{ color: "var(--color-brand-900)" }}>{icon}</span>
      </div>
      <div style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--color-brand-900)", lineHeight: 1, marginBottom: 6, animation: "count-up 1.2s ease-out forwards" }}>
        {value}
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ─── FEATURE PILL ──────────────────────────────────────────────────
function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(255,255,255,0.07)", borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: "var(--text-xs)", fontWeight: 500 }}>
      <span style={{ color: "var(--color-brand-400)" }}>{icon}</span>
      {text}
    </div>
  );
}

export default function HomePage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [jobs, setJobs]               = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const [stats, setStats] = useState([
    { value: "1,200+",  label: "Hiring Companies",      icon: <Building2 size={22} /> },
    { value: "85,000+", label: "Students Placed",        icon: <GraduationCap size={22} /> },
    { value: "...",     label: "Job & Internship Listings", icon: <Briefcase size={22} /> },
    { value: "25,000+", label: "Registered Users",       icon: <Users size={22} /> },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internshipRes, jobRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/job`),
        ]);
        const internshipsData = Array.isArray(internshipRes.data) ? internshipRes.data : [];
        const jobsData = Array.isArray(jobRes.data) ? jobRes.data : [];
        setInternships(internshipsData);
        setJobs(jobsData);
        setStats([
          { value: "1,200+",  label: "Hiring Companies",          icon: <Building2 size={22} /> },
          { value: "85,000+", label: "Students Placed",            icon: <GraduationCap size={22} /> },
          { value: `${jobsData.length + internshipsData.length}+`, label: "Job & Internship Listings", icon: <Briefcase size={22} /> },
          { value: "25,000+", label: "Registered Users",           icon: <Users size={22} /> },
        ]);
      } catch (err) {
        console.error("Homepage data fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // Filter by category
  const allListings: JobCardProps[] = [
    ...internships.map((i: any) => ({
      _id: i._id, title: i.title, company: i.company, location: i.location,
      workMode: i.workMode, jobType: "Internship" as const,
      duration: i.duration, stipend: i.stipend, category: i.category,
      aboutJob: i.aboutInternship,
    })),
    ...jobs.map((j: any) => ({
      _id: j._id, title: j.title, company: j.company, location: j.location,
      workMode: j.workMode, jobType: "Full-time",
      ctc: j.CTC, category: j.category, aboutJob: j.aboutJob,
    })),
  ];

  const filteredByCategory = selectedCategory
    ? allListings.filter(l => l.category === selectedCategory)
    : allListings;

  const latestOpportunities = allListings.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchLocation) params.set("location", searchLocation);
    window.location.href = `/job?${params.toString()}`;
  };

  return (
    <>
      <Head>
        <title>InternArea — Find the Right Job. Build Your Career.</title>
        <meta name="description" content="Discover jobs and internships from verified companies. Apply in one click and track your applications." />
      </Head>

      <Navbar />

      <main style={{ background: "var(--color-background)" }}>

        {/* ─── HERO SECTION ─────────────────────────────────── */}
        <section style={{ padding: "72px 0 80px", position: "relative", overflow: "hidden" }}>
          {/* Background orbs */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "var(--color-brand-100)", opacity: 0.6, filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -60, width: 320, height: 320, borderRadius: "50%", background: "var(--color-accent-100)", opacity: 0.5, filter: "blur(60px)", pointerEvents: "none" }} />

          <div className="page-container" style={{ position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="hero-grid">

              {/* Left: Text + Search */}
              <div style={{ animation: "fade-in-up 0.6s ease-out forwards" }}>
                {/* Trust signal */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--color-brand-100)", borderRadius: "var(--radius-full)", marginBottom: 24, border: "1px solid var(--color-brand-200)" }}>
                  <TrendingUp size={13} color="var(--color-brand-900)" />
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)" }}>
                    12,500+ active opportunities right now
                  </span>
                </div>

                <h1 style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--color-neutral-900)", marginBottom: 16 }}>
                  Find the right job.<br />
                  <span style={{ color: "var(--color-brand-900)" }}>Build your career.</span>
                </h1>
                <p style={{ fontSize: "var(--text-lg)", color: "var(--color-neutral-600)", lineHeight: 1.65, marginBottom: 36, maxWidth: 480 }}>
                  Discover jobs and internships from verified companies.
                  Apply in one click and track your applications.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ display: "flex", background: "var(--color-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "12px 16px", gap: 10, borderRight: "1px solid var(--border-subtle)" }}>
                    <Search size={16} color="var(--color-neutral-400)" style={{ flexShrink: 0 }} />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Job title, skills or company"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", color: "var(--color-neutral-900)", background: "transparent", width: "100%" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 10, flex: "0 0 180px" }}>
                    <MapPin size={16} color="var(--color-neutral-400)" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={e => setSearchLocation(e.target.value)}
                      style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", color: "var(--color-neutral-900)", background: "transparent", width: "100%" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ margin: 6, borderRadius: "var(--radius-md)", padding: "0 24px", flexShrink: 0 }}>
                    Search
                  </button>
                </form>

                {/* Popular Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500 }}>Popular:</span>
                  {["Software Engineer", "Product Manager", "Data Analyst", "UI/UX Designer"].map(tag => (
                    <Link key={tag} href={`/job?q=${encodeURIComponent(tag)}`}
                      style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-900)", fontWeight: 500, padding: "3px 10px", background: "var(--color-brand-50)", borderRadius: "var(--radius-full)", border: "1px solid var(--color-brand-200)", textDecoration: "none", transition: "all 0.15s" }}>
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Trust Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                  {[
                    { icon: <Shield size={13} />, text: "Verified companies" },
                    { icon: <Zap size={13} />,    text: "1-click application" },
                    { icon: <TrendingUp size={13} />, text: "Track applications" },
                  ].map(p => (
                    <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-neutral-600)" }}>
                      <span style={{ color: "var(--color-brand-900)" }}>{p.icon}</span>
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: 3D Illustration + Interactive Floating Badges */}
              <div style={{ position: "relative", minHeight: 440, display: "flex", alignItems: "center", justifyContent: "center" }} className="hero-right">
                
                {/* Ambient Radial Pulsing Glow */}
                <div style={{
                  position: "absolute",
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(63, 146, 152, 0.3) 0%, rgba(231, 243, 242, 0) 70%)",
                  filter: "blur(40px)",
                  animation: "pulseGlow 6s ease-in-out infinite",
                  pointerEvents: "none",
                  zIndex: 0,
                }} />

                {/* Main Hero Image Container with 3D Hover Effect */}
                <div
                  className="hero-image-card"
                  style={{
                    position: "relative",
                    width: 360,
                    height: 360,
                    borderRadius: "32px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 24px 60px -12px rgba(31, 95, 102, 0.22), 0 12px 24px -8px rgba(20, 33, 36, 0.08)",
                    background: "#F9FAF8",
                    zIndex: 1,
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-8px) scale(1.02)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 32px 70px -10px rgba(31, 95, 102, 0.3), 0 16px 32px -8px rgba(20, 33, 36, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px -12px rgba(31, 95, 102, 0.22), 0 12px 24px -8px rgba(20, 33, 36, 0.08)";
                  }}
                >
                  <img
                    src="/hero-career.jpg"
                    alt="Career Launch and Internship Platform"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  {/* Subtle glass shimmer gradient */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Floating stat 1: Active opportunities (Top Left) */}
                <div
                  className="glass-hero floating-badge-1"
                  style={{
                    position: "absolute",
                    top: 10,
                    left: -20,
                    padding: "12px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    zIndex: 3,
                    boxShadow: "0 12px 30px rgba(20, 33, 36, 0.1), 0 2px 8px rgba(31, 95, 102, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                    transition: "transform 0.25s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    background: "var(--color-brand-100)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-brand-900)",
                    position: "relative",
                  }}>
                    <Briefcase size={20} />
                    {/* Live pulse green dot */}
                    <span style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--color-success-500)",
                      border: "2px solid #fff",
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--color-neutral-900)", lineHeight: 1.1 }}>
                      {(internships.length + jobs.length) || "12,500"}+
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 600, marginTop: 2 }}>Active Opportunities</div>
                  </div>
                </div>

                {/* Floating stat 2: Students placed (Bottom Right) */}
                <div
                  className="glass-hero floating-badge-2"
                  style={{
                    position: "absolute",
                    bottom: 15,
                    right: -20,
                    padding: "12px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    zIndex: 3,
                    boxShadow: "0 12px 30px rgba(20, 33, 36, 0.1), 0 2px 8px rgba(31, 95, 102, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                    transition: "transform 0.25s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  <div style={{ display: "flex", marginRight: 2 }}>
                    {[
                      { bg: "#1F5F66", text: "A" },
                      { bg: "#E87900", text: "R" },
                      { bg: "#218657", text: "S" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--radius-full)",
                          background: item.bg,
                          border: "2px solid #fff",
                          marginLeft: i > 0 ? -10 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--color-neutral-900)", lineHeight: 1.1 }}>25,000+</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 600, marginTop: 2 }}>Students Placed</div>
                  </div>
                </div>

                {/* Floating Accent Chip 3 (Top Right) */}
                <div
                  className="glass-hero floating-badge-3"
                  style={{
                    position: "absolute",
                    top: 25,
                    right: -10,
                    padding: "6px 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    zIndex: 3,
                    borderRadius: "var(--radius-full)",
                    background: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid rgba(31, 95, 102, 0.15)",
                    boxShadow: "0 6px 16px rgba(31, 95, 102, 0.08)",
                  }}
                >
                  <Sparkles size={13} color="var(--color-accent-600)" />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-brand-900)" }}>
                    Verified Hiring
                  </span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ─── LATEST OPPORTUNITIES ─────────────────────────── */}
        <section style={{ padding: "64px 0" }}>
          <div className="page-container">
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h2 className="heading-section" style={{ marginBottom: 4 }}>Latest opportunities</h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>
                  {allListings.length} active listings
                </p>
              </div>
              <Link href="/job" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none" }}>
                View all jobs <ArrowRight size={14} />
              </Link>
            </div>

            {/* 4-column card row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="card-grid-4">
              {latestOpportunities.map(job => (
                <JobCard key={job._id} {...job} />
              ))}
              {latestOpportunities.length === 0 && (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 220, borderRadius: "var(--radius-lg)" }} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* ─── BROWSE BY CATEGORY ───────────────────────────── */}
        <section style={{ padding: "56px 0", background: "var(--color-surface)" }}>
          <div className="page-container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 className="heading-section">Browse by category</h2>
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36 }}>
              {CATEGORY_CONFIG.map(cat => {
                const active = selectedCategory === cat.key;
                const count = cat.key === ""
                  ? allListings.length
                  : allListings.filter(l => l.category === cat.key).length;

                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 20px",
                      borderRadius: "var(--radius-md)",
                      border: active ? "1px solid var(--color-brand-900)" : "1px solid var(--border-default)",
                      background: active ? "var(--color-brand-900)" : "var(--color-surface)",
                      color: active ? "#fff" : "var(--color-neutral-700)",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      boxShadow: active ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    <span style={{ color: active ? "rgba(255,255,255,0.9)" : "var(--color-brand-900)" }}>{cat.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, lineHeight: 1.2 }}>{cat.label}</div>
                      <div style={{ fontSize: "var(--text-xs)", opacity: 0.7 }}>{count}+ listings</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filtered results */}
            {filteredByCategory.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {filteredByCategory.slice(0, 6).map(job => (
                  <JobCard key={job._id} {...job} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-neutral-400)" }}>
                <Briefcase size={40} style={{ margin: "0 auto 12px" }} />
                <p>No listings found in this category yet.</p>
              </div>
            )}

            {filteredByCategory.length > 6 && (
              <div style={{ textAlign: "center", marginTop: 28 }}>
                <Link href={`/job?category=${selectedCategory}`} className="btn btn-secondary">
                  View all {filteredByCategory.length} listings <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── TOP COMPANIES ────────────────────────────────── */}
        <section style={{ padding: "56px 0" }}>
          <div className="page-container">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 className="heading-section">Top companies hiring</h2>
              <Link href="/job" style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View all companies <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
              {TOP_COMPANIES.map(co => (
                <Link
                  key={co.name}
                  href={`/job?company=${encodeURIComponent(co.name)}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 24px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    transition: "all 0.18s ease",
                    boxShadow: "var(--shadow-xs)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-300)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: "var(--radius-xs)", background: co.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                    {co.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-neutral-800)" }}>{co.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOR EMPLOYERS BANNER ─────────────────────────── */}
        <section style={{ padding: "56px 0" }}>
          <div className="page-container">
            <div style={{
              borderRadius: "var(--radius-2xl)",
              background: "linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-800) 100%)",
              padding: "52px 48px",
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 24,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }} className="employer-banner">
              {/* Decorative circle */}
              <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", right: 80, bottom: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  FOR EMPLOYERS
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>
                  Hire the right talent, faster.
                </h2>
                <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 380 }}>
                  Post jobs, discover qualified candidates and manage applications from one place.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                  <FeaturePill icon={<Zap size={12} />} text="Post in 2 minutes" />
                  <FeaturePill icon={<Users size={12} />} text="85K+ candidates" />
                  <FeaturePill icon={<Shield size={12} />} text="Verified profiles" />
                </div>
              </div>

              {/* Stats mini card */}
              <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--radius-lg)", padding: "20px 24px", minWidth: 200, position: "relative" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Total Applications</div>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {(internships.length + jobs.length) > 0 ? `${internships.length + jobs.length}` : "1,248"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <TrendingUp size={12} color="var(--color-success-500)" />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success-500)", fontWeight: 500 }}>+12% this week</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
                <Link href="/postjob" className="btn btn-accent">
                  Post a Job for Free →
                </Link>
                <Link href="/adminlogin" style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
                  Employer login →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PLATFORM STATS ───────────────────────────────── */}
        <section style={{ padding: "56px 0", background: "var(--color-surface)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="page-container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }} className="stats-grid">
              {stats.map((stat, i) => (
                <div key={stat.label} style={{ borderRight: i < stats.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <StatCounter value={stat.value} label={stat.label} icon={stat.icon} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        @keyframes floatBadge1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes floatBadge2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatBadge3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        .floating-badge-1 {
          animation: floatBadge1 5s ease-in-out infinite;
        }
        .floating-badge-2 {
          animation: floatBadge2 6s ease-in-out 0.8s infinite;
        }
        .floating-badge-3 {
          animation: floatBadge3 4.2s ease-in-out 1.5s infinite;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .card-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .employer-banner { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .card-grid-4 { grid-template-columns: 1fr !important; }
          .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}