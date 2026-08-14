import { selectuser } from "@/Feature/Userslice";
import { Mail, User, FileText, Briefcase, CheckCircle, Shield, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SidebarLayout from "@/component/SidebarLayout";

export default function ProfilePage() {
  const user = useSelector(selectuser);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [appStats, setAppStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  React.useEffect(() => {
    if (!user?.uid) return;

    // Fetch login history
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/history/${user.uid}`, {
      headers: { "x-requesting-uid": user.uid },
    }).then(res => setLoginHistory(res.data)).catch(console.error);

    // Fetch application stats
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application`).then(res => {
      const userApps = (res.data || []).filter((app: any) => app.user?.uid === user.uid);
      setAppStats({
        total:    userApps.length,
        approved: userApps.filter((a: any) => a.status === "approved").length,
        pending:  userApps.filter((a: any) => !a.status || a.status === "pending").length,
        rejected: userApps.filter((a: any) => a.status === "rejected").length,
      });
    }).catch(console.error);
  }, [user]);

  const statusBadge = (status: string) => {
    if (status === "Success" || status === "OTP Verified")
      return <span className="badge badge-approved">{status}</span>;
    if (status === "Pending OTP")
      return <span className="badge badge-pending">{status}</span>;
    return <span className="badge badge-rejected">{status}</span>;
  };

  const statCards = [
    { value: appStats.total,    label: "Total Applications", color: "var(--color-brand-900)",   bg: "var(--color-brand-100)" },
    { value: appStats.approved, label: "Approved",           color: "var(--color-success-700)", bg: "var(--color-success-50)" },
    { value: appStats.pending,  label: "Pending",            color: "var(--color-warning-600)", bg: "var(--color-warning-100)" },
    { value: appStats.rejected, label: "Rejected",           color: "var(--color-error-600)",   bg: "var(--color-error-100)" },
  ];

  return (
    <>
      <Head>
        <title>My Profile — InternArea</title>
      </Head>
      <SidebarLayout>
        <div style={{ padding: "32px", minHeight: "100vh", background: "var(--color-background)" }}>

          {/* Profile Header Card */}
          <div className="card" style={{ marginBottom: 24, overflow: "hidden" }}>
            {/* Cover */}
            <div style={{ height: 100, background: "linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-700) 100%)", position: "relative" }}>
              <div style={{ position: "absolute", right: 20, bottom: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div style={{ padding: "0 28px 28px", position: "relative" }}>
              {/* Avatar */}
              <div style={{ marginTop: -36, marginBottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", border: "3px solid var(--color-surface)", boxShadow: "var(--shadow-sm)", overflow: "hidden", background: "var(--color-neutral-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {user?.photo ? (
                    <img src={user.photo} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <User size={32} color="var(--color-neutral-400)" />
                  )}
                </div>
                <Link href="/userapplication" className="btn btn-secondary btn-sm">
                  View Applications →
                </Link>
              </div>

              <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 4 }}>
                {user?.name || "Your Name"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-neutral-500)", fontSize: "var(--text-sm)" }}>
                <Mail size={14} />
                <span>{user?.email}</span>
              </div>

              {/* Profile Strength */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-600)" }}>Profile Strength</span>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)" }}>
                    {user?.photo ? "75%" : "50%"}
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: user?.photo ? "75%" : "50%", background: "var(--color-brand-900)", borderRadius: "var(--radius-full)", transition: "width 0.6s ease" }} />
                </div>
              </div>

              {/* Quick links */}
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <Link href="/resume" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-brand-900)", textDecoration: "none", padding: "6px 12px", background: "var(--color-brand-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-brand-200)" }}>
                  <FileText size={13} /> Resume Builder
                </Link>
                <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-neutral-700)", textDecoration: "none", padding: "6px 12px", background: "var(--color-neutral-50)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)" }}>
                  <Briefcase size={13} /> Upgrade Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }} className="stats-grid">
            {statCards.map(stat => (
              <div key={stat.label} className="card" style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: stat.color, lineHeight: 1, marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Login History */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={17} color="var(--color-brand-900)" />
              <div>
                <h2 style={{ fontSize: "var(--text-md)", fontWeight: 600, color: "var(--color-neutral-900)", margin: 0 }}>Recent Login Activity</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", margin: "2px 0 0" }}>Security log of devices accessing your account</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--color-neutral-50)" }}>
                    {["Date & Time", "Browser", "Device / OS", "IP Address", "Status"].map(col => (
                      <th key={col} style={{ padding: "10px 20px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                        No recent login activity found.
                      </td>
                    </tr>
                  )}
                  {loginHistory.map((record, i) => (
                    <tr key={record._id} style={{ borderTop: "1px solid var(--border-subtle)", background: i % 2 === 0 ? "transparent" : "var(--color-neutral-50)" }}>
                      <td style={{ padding: "12px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>
                        {new Date(record.createdAt).toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: "var(--text-sm)", color: "var(--color-neutral-800)", fontWeight: 500 }}>
                        {record.browser}
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-600)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {record.deviceType === "Mobile" ? <Smartphone size={12} /> : <Monitor size={12} />}
                          {record.deviceType} / {record.os}
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontFamily: "monospace" }}>
                        {record.ipAddress}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        {statusBadge(record.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </SidebarLayout>

      <style>{`
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}