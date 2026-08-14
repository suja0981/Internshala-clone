import axios from "axios";
import { Building2, Calendar, FileText, User, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SidebarLayout from "@/component/SidebarLayout";
import StatusBadge from "@/component/StatusBadge";

const STEPS = ["Applied", "Under Review", "Interview", "Decision"];

function getStepIndex(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "approved" || s === "offered") return 3;
  if (s === "interview") return 2;
  if (s === "shortlisted") return 1;
  if (s === "rejected") return -1;
  return 0; // pending/applied
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !data) {
    return (
      <SidebarLayout>
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--color-brand-200)", borderTopColor: "var(--color-brand-900)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 14px" }} />
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>Loading application…</p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </SidebarLayout>
    );
  }

  const status       = data.status || "pending";
  const stepIndex    = getStepIndex(status);
  const isRejected   = status.toLowerCase() === "rejected";
  const appliedDate  = new Date(data.createdAt || data.createAt);

  return (
    <>
      <Head>
        <title>Application — {data.company} — InternArea</title>
      </Head>
      <SidebarLayout>
        <div style={{ padding: "32px", background: "var(--color-background)", minHeight: "100vh" }}>

          {/* Back + Header */}
          <div style={{ marginBottom: 24 }}>
            <Link href="/userapplication" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", textDecoration: "none", fontWeight: 500, marginBottom: 16 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-brand-900)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)"; }}>
              <ArrowLeft size={14} /> Back to Applications
            </Link>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-neutral-900)", margin: 0 }}>Application Detail</h1>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Status Banner */}
          <div style={{
            padding: "16px 20px",
            marginBottom: 24,
            borderRadius: "var(--radius-md)",
            border: `1px solid ${isRejected ? "var(--color-error-100)" : "var(--color-brand-200)"}`,
            background: isRejected ? "var(--color-error-100)" : "var(--color-brand-50)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            {isRejected
              ? <XCircle size={20} color="var(--color-error-600)" />
              : status.toLowerCase() === "approved"
                ? <CheckCircle size={20} color="var(--color-success-600)" />
                : <Clock size={20} color="var(--color-brand-900)" />
            }
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: isRejected ? "var(--color-error-600)" : "var(--color-brand-900)" }}>
                {isRejected
                  ? "Your application was not selected this time"
                  : status.toLowerCase() === "approved"
                    ? "Congratulations! Your application was approved"
                    : "Your application is being reviewed"}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 2 }}>
                Applied on {appliedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }} className="app-detail-grid">

            {/* Main */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Progress Steps */}
              {!isRejected && (
                <div className="card" style={{ padding: "24px" }}>
                  <h2 style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 24 }}>Application Progress</h2>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
                    {STEPS.map((step, i) => {
                      const done    = i <= stepIndex;
                      const current = i === stepIndex;
                      return (
                        <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          {/* Connector line */}
                          {i < STEPS.length - 1 && (
                            <div style={{ position: "absolute", top: 16, left: "50%", width: "100%", height: 2, background: i < stepIndex ? "var(--color-brand-900)" : "var(--color-neutral-200)", zIndex: 0 }} />
                          )}
                          {/* Circle */}
                          <div style={{
                            width: 32, height: 32,
                            borderRadius: "50%",
                            background: done ? "var(--color-brand-900)" : "var(--color-neutral-100)",
                            border: current ? "3px solid var(--color-brand-900)" : done ? "none" : "2px solid var(--color-neutral-300)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: done ? "#fff" : "var(--color-neutral-400)",
                            fontWeight: 700, fontSize: 13,
                            position: "relative", zIndex: 1,
                            transition: "all 0.3s ease",
                            boxShadow: current ? "0 0 0 4px var(--color-brand-100)" : "none",
                          }}>
                            {done ? <CheckCircle size={16} /> : i + 1}
                          </div>
                          <div style={{ marginTop: 8, fontSize: "var(--text-xs)", fontWeight: done ? 600 : 400, color: done ? "var(--color-brand-900)" : "var(--color-neutral-400)", textAlign: "center" }}>
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {data.coverLetter && (
                <div className="card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <FileText size={17} color="var(--color-brand-900)" />
                    <h2 style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-900)", margin: 0 }}>Your Cover Letter</h2>
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                    {data.coverLetter}
                  </p>
                </div>
              )}

              {/* Availability */}
              {data.availability && (
                <div className="card" style={{ padding: "24px" }}>
                  <h2 style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-900)", marginBottom: 10 }}>Availability</h2>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)" }}>{data.availability}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              {/* Company + Applicant */}
              <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--color-brand-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building2 size={15} color="var(--color-brand-900)" />
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, marginBottom: 2 }}>Company</div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)" }}>{data.company}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--color-neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={15} color="var(--color-neutral-600)" />
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, marginBottom: 2 }}>Applicant</div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)" }}>{data.user?.name}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)" }}>{data.user?.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--color-neutral-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Calendar size={15} color="var(--color-neutral-600)" />
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, marginBottom: 2 }}>Applied On</div>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-neutral-900)" }}>
                        {appliedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant photo if available */}
              {data?.user?.photo && (
                <div className="card" style={{ padding: "16px", textAlign: "center" }}>
                  <img src={data.user.photo} alt={data.user.name} style={{ width: 80, height: 80, borderRadius: "var(--radius-full)", border: "3px solid var(--border-default)", margin: "0 auto 8px", display: "block", objectFit: "cover" }} />
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)" }}>{data.user.name}</div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </SidebarLayout>
      <style>{`
        @media (max-width: 768px) {
          .app-detail-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}