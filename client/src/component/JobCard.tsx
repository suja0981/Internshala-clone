import React from "react";
import Link from "next/link";
import { MapPin, Wifi, Clock, Bookmark, Star, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  location?: string;
  workMode?: string;
  jobType?: "Internship" | "Full-time" | "Part-time" | "Contract" | "Freelance" | string;
  duration?: string;
  stipend?: string;
  ctc?: string;
  category?: string;
  aboutJob?: string;
  postedAt?: string;
  variant?: "default" | "compact" | "featured" | "applied";
  applicationStatus?: string;
  detailPath?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

function CompanyLogo({ company }: { company: string }) {
  const colors = [
    ["#EA4335","#FBBC04","#34A853","#4285F4"], // Google-like
    ["#F05A28", "#F05A28"],                     // orange
    ["#7B2FBE", "#7B2FBE"],                     // purple
    ["#1DA462", "#1DA462"],                     // green
    ["#2563EB", "#2563EB"],                     // blue
  ];
  const idx = company.charCodeAt(0) % colors.length;
  const palette = colors[idx];

  if (palette.length === 4) {
    return (
      <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", flexShrink: 0 }}>
        {palette.map((c, i) => <div key={i} style={{ background: c }} />)}
      </div>
    );
  }
  return (
    <div style={{
      width: 36, height: 36,
      borderRadius: "var(--radius-sm)",
      background: palette[0],
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, color: "#fff", fontWeight: 700, fontSize: 16,
    }}>
      {company.charAt(0).toUpperCase()}
    </div>
  );
}

function MetaTag({ label }: { label: string }) {
  return (
    <span className="tag-neutral" style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px",
      fontSize: "var(--text-xs)", fontWeight: 500,
      borderRadius: "var(--radius-full)",
      background: "var(--color-neutral-100)",
      color: "var(--color-neutral-700)",
      border: "1px solid var(--border-default)",
    }}>
      {label}
    </span>
  );
}

// ─── DEFAULT CARD ──────────────────────────────────────────────────
function DefaultCard({ job }: { job: JobCardProps }) {
  const detailHref = job.detailPath || `/${job.jobType === "Internship" ? "detailinternship" : "detailjob"}/${job._id}`;
  const compensation = job.ctc || job.stipend || null;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CompanyLogo company={job.company} />
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)", lineHeight: 1.3 }}>{job.title}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 2 }}>{job.company}</div>
          </div>
        </div>
        {job.onSave && (
          <button
            onClick={e => { e.preventDefault(); job.onSave?.(); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: job.isSaved ? "var(--color-brand-900)" : "var(--color-neutral-400)", padding: 4, flexShrink: 0 }}
            aria-label="Save job"
          >
            <Bookmark size={16} fill={job.isSaved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Location / Work Mode */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        {job.location && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>
            <MapPin size={12} /> {job.location}
          </span>
        )}
        {job.workMode && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>
            <Wifi size={12} /> {job.workMode}
          </span>
        )}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {job.jobType && <MetaTag label={job.jobType} />}
        {job.duration && <MetaTag label={job.duration} />}
        {job.category && <MetaTag label={job.category} />}
      </div>

      {/* Compensation */}
      {compensation && (
        <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-800)" }}>
          {compensation}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href={detailHref}
          style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = "8px"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = "4px"; }}
        >
          Apply Now <ArrowRight size={14} />
        </Link>
        {job.postedAt && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {job.postedAt}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── COMPACT CARD (list row) ────────────────────────────────────────
function CompactCard({ job }: { job: JobCardProps }) {
  const detailHref = job.detailPath || `/${job.jobType === "Internship" ? "detailinternship" : "detailjob"}/${job._id}`;
  const compensation = job.ctc || job.stipend || null;

  return (
    <div className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <CompanyLogo company={job.company} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{job.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{job.company}</span>
          {job.location && <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{job.location}</span>}
          {job.workMode && <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>{job.workMode}</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
        {job.jobType && <MetaTag label={job.jobType} />}
        {job.duration && <MetaTag label={job.duration} />}
      </div>
      {compensation && (
        <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-800)", whiteSpace: "nowrap", minWidth: 100, textAlign: "right" }}>{compensation}</div>
      )}
      <Link href={detailHref} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
        Apply →
      </Link>
    </div>
  );
}

// ─── FEATURED CARD ──────────────────────────────────────────────────
function FeaturedCard({ job }: { job: JobCardProps }) {
  const detailHref = job.detailPath || `/${job.jobType === "Internship" ? "detailinternship" : "detailjob"}/${job._id}`;
  const compensation = job.ctc || job.stipend || null;

  return (
    <div className="card-featured" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* Featured Badge */}
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: "var(--radius-full)", background: "var(--color-accent-500)", color: "var(--color-neutral-950)", fontSize: "var(--text-xs)", fontWeight: 700 }}>
          <Star size={10} fill="currentColor" /> Featured
        </span>
      </div>

      {/* Decorative circle */}
      <div style={{ position: "absolute", right: -20, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontWeight: 700, fontSize: 18 }}>
          {job.company.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "var(--text-md)", color: "#fff" }}>{job.title}</div>
          <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{job.company}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        {job.location && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)" }}><MapPin size={11} /> {job.location}</span>}
        {job.workMode && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)" }}><Wifi size={11} /> {job.workMode}</span>}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {[job.jobType, job.duration].filter(Boolean).map((tag, i) => (
          <span key={i} style={{ padding: "3px 10px", borderRadius: "var(--radius-full)", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: "var(--text-xs)", fontWeight: 500 }}>{tag}</span>
        ))}
      </div>

      {job.aboutJob && (
        <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {job.aboutJob}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        {compensation && <span style={{ fontWeight: 700, fontSize: "var(--text-md)", color: "#fff" }}>{compensation}</span>}
        <Link href={detailHref} className="btn btn-accent btn-sm">
          Apply Now →
        </Link>
      </div>
    </div>
  );
}

// ─── APPLIED CARD ───────────────────────────────────────────────────
function AppliedCard({ job }: { job: JobCardProps }) {
  const detailHref = job.detailPath || `/detailapplication/${job._id}`;
  const compensation = job.ctc || job.stipend || null;

  return (
    <div className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <CompanyLogo company={job.company} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{job.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{job.company}</span>
          {job.location && <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>· {job.location}</span>}
          {compensation && <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>· {compensation}</span>}
        </div>
      </div>
      {job.applicationStatus && <StatusBadge status={job.applicationStatus} />}
      <Link href={detailHref} style={{ fontSize: "var(--text-sm)", color: "var(--color-brand-900)", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
        View →
      </Link>
    </div>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────
export default function JobCard(props: JobCardProps) {
  const { variant = "default" } = props;

  switch (variant) {
    case "compact":  return <CompactCard job={props} />;
    case "featured": return <FeaturedCard job={props} />;
    case "applied":  return <AppliedCard job={props} />;
    default:         return <DefaultCard job={props} />;
  }
}
