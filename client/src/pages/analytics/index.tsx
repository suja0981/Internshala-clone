import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart2, Users, FileText, CheckCircle, Clock, TrendingUp, ShieldAlert, Award } from "lucide-react";
import AdminLayout from "@/component/AdminLayout";
import Head from "next/head";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalJobs: 0,
    totalInternships: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const headers = token ? { 'x-admin-token': token } : {};
        const [usersRes, appsRes, jobsRes, internshipsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/job`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`),
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const applications = Array.isArray(appsRes.data) ? appsRes.data : [];
        const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const internships = Array.isArray(internshipsRes.data) ? internshipsRes.data : [];

        const approved = applications.filter((app: any) => app.status === 'approved').length;
        const pending = applications.filter((app: any) => !app.status || app.status === 'pending').length;
        const rejected = applications.filter((app: any) => app.status === 'rejected').length;

        setStats({
          totalUsers: users.length,
          totalApplications: applications.length,
          approvedApplications: approved,
          pendingApplications: pending,
          rejectedApplications: rejected,
          totalJobs: jobs.length,
          totalInternships: internships.length,
        });
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const approvalRate = stats.totalApplications > 0
    ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
    : 0;

  return (
    <>
      <Head>
        <title>Analytics Dashboard — Admin</title>
      </Head>

      <AdminLayout
        title="Platform Analytics"
        subtitle="Real-time performance metrics, conversion ratios, and volume overview."
      >
        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }} className="analytics-metrics-grid">
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Total Users</span>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-neutral-900)" }}>{stats.totalUsers}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success-700)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={12} /> Active community
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Total Applications</span>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={18} />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-neutral-900)" }}>{stats.totalApplications}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 6 }}>
              {stats.pendingApplications} awaiting review
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Approval Rate</span>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-success-50)", color: "var(--color-success-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={18} />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-success-700)" }}>{approvalRate}%</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 6 }}>
              {stats.approvedApplications} approved submissions
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase" }}>Total Listings</span>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-accent-100)", color: "var(--color-accent-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-neutral-900)" }}>{stats.totalJobs + stats.totalInternships}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 6 }}>
              {stats.totalJobs} jobs, {stats.totalInternships} internships
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="analytics-breakdown-grid">
          {/* Application Status Pipeline */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 20 }}>
              Application Funnel
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: "var(--color-neutral-700)" }}>Pending Evaluation</span>
                  <span style={{ color: "var(--color-warning-700)" }}>{stats.pendingApplications} ({stats.totalApplications > 0 ? Math.round((stats.pendingApplications / stats.totalApplications) * 100) : 0}%)</span>
                </div>
                <div style={{ height: 8, background: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stats.totalApplications > 0 ? (stats.pendingApplications / stats.totalApplications) * 100 : 0}%`, background: "var(--color-warning-500)", borderRadius: "var(--radius-full)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: "var(--color-neutral-700)" }}>Approved &amp; Shortlisted</span>
                  <span style={{ color: "var(--color-success-700)" }}>{stats.approvedApplications} ({approvalRate}%)</span>
                </div>
                <div style={{ height: 8, background: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${approvalRate}%`, background: "var(--color-success-500)", borderRadius: "var(--radius-full)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: "var(--color-neutral-700)" }}>Rejected</span>
                  <span style={{ color: "var(--color-error-700)" }}>{stats.rejectedApplications} ({stats.totalApplications > 0 ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 0}%)</span>
                </div>
                <div style={{ height: 8, background: "var(--color-neutral-100)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stats.totalApplications > 0 ? (stats.rejectedApplications / stats.totalApplications) * 100 : 0}%`, background: "var(--color-error-500)", borderRadius: "var(--radius-full)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Opportunity Distribution */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 20 }}>
              Opportunity Portfolio
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--color-neutral-50)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-brand-900)", marginBottom: 4 }}>
                  {stats.totalJobs}
                </div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                  Full-Time Jobs
                </div>
              </div>

              <div style={{ background: "var(--color-neutral-50)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-accent-700)", marginBottom: 4 }}>
                  {stats.totalInternships}
                </div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                  Internship Roles
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>

      <style>{`
        @media (max-width: 1024px) {
          .analytics-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .analytics-breakdown-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .analytics-metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
