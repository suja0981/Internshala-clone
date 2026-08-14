import axios from "axios";
import {
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  User,
  ArrowRight,
  Filter,
  Layers
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "@/component/AdminLayout";
import StatusBadge from "@/component/StatusBadge";
import Head from "next/head";

const STATUS_TABS = ["all", "pending", "approved", "rejected"] as const;

export default function AdminApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<typeof STATUS_TABS[number]>("all");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, action: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application/${id}`,
        { action },
        { headers: { 'x-admin-token': token || '' } }
      );
      const updatedList = data.map((app: any) =>
        app._id === id ? res.data.data : app
      );
      setData(updatedList);
      toast.success(`Application marked as ${action}`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating application status");
    }
  };

  const filteredApplications = data.filter((application: any) => {
    const company = (application.company || "").toString().toLowerCase();
    const category = (application.category || "").toString().toLowerCase();
    const userName = (application.user?.name || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = company.includes(term) || category.includes(term) || userName.includes(term);

    if (filter === "all") return matchesSearch;
    return matchesSearch && (application.status || "pending").toLowerCase() === filter;
  });

  const tabCounts = {
    all: data.length,
    pending: data.filter((a: any) => !a.status || a.status.toLowerCase() === "pending").length,
    approved: data.filter((a: any) => (a.status || "").toLowerCase() === "approved").length,
    rejected: data.filter((a: any) => (a.status || "").toLowerCase() === "rejected").length,
  };

  return (
    <>
      <Head>
        <title>Manage Applications — Admin</title>
      </Head>

      <AdminLayout
        title="Candidate Applications"
        subtitle="Review, approve, or reject job and internship submissions."
      >
        <div className="card" style={{ overflow: "hidden" }}>
          {/* Top Search & Filter Bar */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: 280, flex: "1 1 300px" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company, applicant, or category..."
                className="input input-sm"
                style={{ paddingLeft: 36 }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 6, background: "var(--color-neutral-100)", padding: "4px", borderRadius: "var(--radius-md)" }}>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "6px 12px",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: filter === tab ? "var(--color-surface)" : "transparent",
                    color: filter === tab ? "var(--color-neutral-900)" : "var(--color-neutral-600)",
                    boxShadow: filter === tab ? "var(--shadow-xs)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.12s"
                  }}
                >
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>({tabCounts[tab]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Company & Role", "Applicant Details", "Applied On", "Status", "Actions"].map((col) => (
                    <th key={col} style={{ padding: "12px 20px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} style={{ padding: "16px 20px" }}><div className="skeleton" style={{ height: 28, borderRadius: "var(--radius-sm)" }} /></td></tr>
                  ))
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app: any) => (
                    <tr
                      key={app._id}
                      style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-50)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                            {app.company?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{app.company}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{app.category}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-neutral-900)" }}>{app.user?.name || "Anonymous"}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{app.user?.email}</div>
                      </td>

                      <td style={{ padding: "14px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>
                        {new Date(app.createdAt || app.createAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <StatusBadge status={app.status || "pending"} />
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Link
                            href={`/detailapplication/${app._id}`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border-default)",
                              background: "var(--color-surface)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                              color: "var(--color-neutral-700)",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4
                            }}
                          >
                            View <ArrowRight size={11} />
                          </Link>

                          <button
                            onClick={() => handleUpdateStatus(app._id, "approved")}
                            title="Approve Candidate"
                            style={{
                              padding: "5px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--color-success-200)",
                              background: "var(--color-success-50)",
                              color: "var(--color-success-700)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <CheckCircle size={15} />
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(app._id, "rejected")}
                            title="Reject Candidate"
                            style={{
                              padding: "5px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--color-error-200)",
                              background: "var(--color-error-50)",
                              color: "var(--color-error-700)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}