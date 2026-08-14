import React, { useEffect, useState } from "react";
import { Search, Briefcase, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { selectuser } from "@/Feature/Userslice";
import { useSelector } from "react-redux";
import SidebarLayout from "@/component/SidebarLayout";
import StatusBadge from "@/component/StatusBadge";

const STATUS_TABS = ["all", "pending", "approved", "rejected"] as const;

export default function UserApplicationsPage() {
  const user        = useSelector(selectuser);
  const [data, setData]         = useState<any[]>([]);
  const [searchTerm, setSearch] = useState("");
  const [activeTab, setTab]     = useState<typeof STATUS_TABS[number]>("all");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userApps = data.filter((app: any) => app.user?.uid === user?.uid);
  const filtered = userApps.filter((app: any) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      (app.company || "").toLowerCase().includes(q) ||
      (app.category || "").toLowerCase().includes(q);
    const matchStatus = activeTab === "all" || (app.status || "pending").toLowerCase() === activeTab;
    return matchSearch && matchStatus;
  });

  const tabCounts = {
    all:      userApps.length,
    pending:  userApps.filter((a: any) => !a.status || a.status.toLowerCase() === "pending").length,
    approved: userApps.filter((a: any) => (a.status || "").toLowerCase() === "approved").length,
    rejected: userApps.filter((a: any) => (a.status || "").toLowerCase() === "rejected").length,
  };

  return (
    <>
      <Head>
        <title>My Applications — InternArea</title>
      </Head>
      <SidebarLayout>
        <div style={{ padding: "32px", minHeight: "100vh", background: "var(--color-background)" }}>

          {/* Page Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 4 }}>My Applications</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>Track and manage all your job and internship applications</p>
          </div>

          {/* Search + Tabs */}
          <div className="card" style={{ marginBottom: 20, overflow: "hidden" }}>
            {/* Search */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ position: "relative", maxWidth: 440 }}>
                <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                <input
                  type="text"
                  placeholder="Search by company or category…"
                  value={searchTerm}
                  onChange={e => setSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            {/* Status Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)" }}>
              {STATUS_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setTab(tab)}
                  style={{
                    padding: "12px 20px",
                    fontSize: "var(--text-sm)", fontWeight: 600,
                    color: activeTab === tab ? "var(--color-brand-900)" : "var(--color-neutral-500)",
                    background: "transparent", border: "none",
                    borderBottom: activeTab === tab ? "2px solid var(--color-brand-900)" : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span style={{
                    fontSize: "var(--text-xs)", padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: activeTab === tab ? "var(--color-brand-100)" : "var(--color-neutral-100)",
                    color: activeTab === tab ? "var(--color-brand-900)" : "var(--color-neutral-500)",
                    fontWeight: 600,
                  }}>
                    {tabCounts[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* Applications Table */}
            {loading ? (
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 60, borderRadius: "var(--radius-sm)" }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "56px 24px", textAlign: "center" }}>
                <Briefcase size={40} color="var(--color-neutral-300)" style={{ margin: "0 auto 16px" }} />
                <p style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-600)", marginBottom: 6 }}>
                  {searchTerm ? "No applications match your search" : "No applications yet"}
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)", marginBottom: 20 }}>
                  {searchTerm ? "Try different keywords" : "Start applying to jobs and internships to see them here."}
                </p>
                <Link href="/job" className="btn btn-primary btn-sm">Browse Jobs →</Link>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--color-neutral-50)" }}>
                      {["Company & Category", "Applied On", "Status", "Action"].map(col => (
                        <th key={col} style={{ padding: "10px 20px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app: any, i: number) => (
                      <tr key={app._id} style={{ borderTop: "1px solid var(--border-subtle)", transition: "background 0.12s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-50)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-brand-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-brand-900)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                              {(app.company || "?").charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-900)" }}>{app.company}</div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{app.category}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>
                          {new Date(app.createdAt || app.createAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <StatusBadge status={app.status || "pending"} />
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <Link
                            href={`/detailapplication/${app._id}`}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none" }}
                          >
                            View <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/job" className="btn btn-secondary btn-sm">
              <Briefcase size={14} /> Browse more jobs
            </Link>
            <Link href="/internship" className="btn btn-secondary btn-sm">
              <FileText size={14} /> Browse internships
            </Link>
          </div>

        </div>
      </SidebarLayout>
    </>
  );
}