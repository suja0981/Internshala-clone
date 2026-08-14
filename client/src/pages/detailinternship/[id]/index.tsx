import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft, MapPin, IndianRupee, Calendar, Clock,
  Star, Users, CheckCircle, X, Zap, Building2, Timer,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import Head from "next/head";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const AVAILABILITY_OPTIONS = [
  "Yes, I am available to join immediately",
  "No, I am currently on notice period",
  "No, I will have to serve notice period",
  "Other",
];

export default function InternshipDetailPage() {
  const user   = useSelector(selectuser);
  const router = useRouter();
  const { id } = router.query;

  const [internship, setInternship]     = useState<any>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [coverLetter, setCoverLetter]   = useState("");
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchInternship = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/internship/${id}`);
        setInternship(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInternship();
  }, [id]);

  const handleSubmit = async () => {
    if (!coverLetter.trim()) { toast.error("Please write a cover letter"); return; }
    if (!availability)       { toast.error("Please select your availability"); return; }
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/application`, {
        category: internship.category,
        company: internship.company,
        coverLetter,
        user,
        Application: id,
        availability,
      });
      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
      router.push("/internship");
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.error === "Limit_Exceeded") {
        toast.error(error.response.data.message);
        router.push("/pricing");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit application");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!internship) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid var(--color-brand-200)", borderTopColor: "var(--color-brand-900)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>Loading internship details…</p>
          </div>
        </div>
        <Footer />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  const metaTags = [
    { icon: <MapPin size={15} />,       label: internship.location },
    { icon: <IndianRupee size={15} />,  label: internship.stipend || "Stipend not disclosed" },
    { icon: <Timer size={15} />,        label: internship.duration },
    { icon: <Calendar size={15} />,     label: internship.startDate || internship.StartDate },
    { icon: <Users size={15} />,        label: `${internship.numberOfopning || 1} opening(s)` },
  ].filter(t => t.label);

  const sections = [
    { title: "About the Internship", content: internship.aboutInternship || internship.aboutJob },
    { title: "Who Can Apply",        content: internship.whoCanApply },
    { title: "Perks & Benefits",     content: internship.perks },
    { title: "Additional Info",      content: internship.AdditionalInfo },
  ].filter(s => s.content);

  return (
    <>
      <Head>
        <title>{internship.title} Internship at {internship.company} — InternArea</title>
        <meta name="description" content={`Apply for ${internship.title} internship at ${internship.company}. ${internship.location}. Stipend: ${internship.stipend || "N/A"}`} />
      </Head>

      <Navbar />

      <div style={{ background: "var(--color-background)", minHeight: "100vh", paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--color-surface)", padding: "12px 0" }}>
          <div className="page-container">
            <Link href="/internship" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", color: "var(--color-neutral-600)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-brand-900)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-600)"; }}>
              <ArrowLeft size={15} /> Back to Internships
            </Link>
          </div>
        </div>

        <div className="page-container" style={{ padding: "32px var(--page-padding-desktop)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }} className="detail-grid">

            {/* Main */}
            <div>
              {/* Header Card */}
              <div className="card" style={{ padding: "28px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 800, flexShrink: 0 }}>
                      {internship.company?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "var(--color-success-100)", color: "var(--color-success-700)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 8 }}>
                        <Zap size={11} fill="currentColor" /> Actively Hiring
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "var(--color-brand-100)", color: "var(--color-brand-900)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 8, marginLeft: 6 }}>
                        Internship
                      </div>
                      <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 4, lineHeight: 1.2 }}>
                        {internship.title}
                      </h1>
                      <div style={{ fontSize: "var(--text-md)", color: "var(--color-neutral-600)", fontWeight: 500 }}>
                        {internship.company}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ flexShrink: 0 }}>
                    Apply Now
                  </button>
                </div>

                {/* Meta tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "16px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
                  {metaTags.map((tag, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", color: "var(--color-neutral-600)" }}>
                      <span style={{ color: "var(--color-brand-900)" }}>{tag.icon}</span>
                      {tag.label}
                    </div>
                  ))}
                </div>

                {internship.createdAt && (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>
                    <Clock size={12} /> Posted on {new Date(internship.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                )}
              </div>

              {/* About Company */}
              {internship.aboutCompany && (
                <div className="card" style={{ padding: "24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Building2 size={17} color="var(--color-brand-900)" />
                    <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-neutral-900)", margin: 0 }}>About {internship.company}</h2>
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.75 }}>{internship.aboutCompany}</p>
                </div>
              )}

              {/* Content Sections */}
              {sections.map(section => (
                <div key={section.title} className="card" style={{ padding: "24px", marginBottom: 16 }}>
                  <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 12 }}>{section.title}</h2>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.75, whiteSpace: "pre-line" }}>{section.content}</p>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <aside>
              <div className="card" style={{ padding: "24px", marginBottom: 16, position: "sticky", top: 80 }}>
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 16 }}>Internship Overview</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { icon: <Calendar size={16} />, label: "Start Date",  value: internship.startDate || internship.StartDate || "Immediate" },
                    { icon: <Timer size={16} />,    label: "Duration",    value: internship.duration },
                    { icon: <IndianRupee size={16} />, label: "Stipend",  value: internship.stipend || "Not disclosed" },
                    { icon: <MapPin size={16} />,   label: "Location",    value: internship.location },
                    { icon: <Users size={16} />,    label: "Openings",    value: internship.numberOfopning || "1" },
                    { icon: <Star size={16} />,     label: "Category",    value: internship.category },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: "var(--color-brand-900)", marginTop: 2, flexShrink: 0 }}>{row.icon}</span>
                      <div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, marginBottom: 2 }}>{row.label}</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-800)", fontWeight: 500 }}>{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}>
                  Apply Now →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isModalOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: "var(--z-modal)" as any, background: "rgba(20,33,36,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-neutral-900)", margin: 0 }}>Apply for this internship</h2>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", margin: "4px 0 0" }}>{internship.title} at {internship.company}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "var(--color-neutral-100)", border: "none", borderRadius: "var(--radius-full)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-neutral-600)" }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--color-brand-50)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-brand-200)" }}>
                <CheckCircle size={16} color="var(--color-brand-900)" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-brand-900)", fontWeight: 500 }}>Your profile and resume will be attached automatically</span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 8 }}>
                  Cover Letter <span style={{ color: "var(--color-error-500)" }}>*</span>
                </label>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginBottom: 8 }}>Why should you be selected for this internship?</p>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder="Write your cover letter here…"
                  className="input"
                  style={{ resize: "vertical", minHeight: 120, lineHeight: 1.6 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 12 }}>
                  Your Availability <span style={{ color: "var(--color-error-500)" }}>*</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: "var(--radius-md)", border: `1px solid ${availability === option ? "var(--color-brand-900)" : "var(--border-default)"}`, background: availability === option ? "var(--color-brand-50)" : "var(--color-surface)", transition: "all 0.15s" }}>
                      <input type="radio" name="avail-intern" value={option} checked={availability === option} onChange={e => setAvailability(e.target.value)} style={{ accentColor: "var(--color-brand-900)", width: 14, height: 14 }} />
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-800)" }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
              {user ? (
                <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary">
                  {submitting ? "Submitting…" : "Submit Application"}
                </button>
              ) : (
                <Link href="/" className="btn btn-primary">Sign up to apply</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}