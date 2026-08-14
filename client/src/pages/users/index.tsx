import axios from "axios";
import { Users, Search, Mail, Shield, User as UserIcon, CheckCircle, Calendar, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "@/component/AdminLayout";
import Head from "next/head";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { 'x-admin-token': token || '' }
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load user accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.displayName || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term) ||
      (user.plan || "").toLowerCase().includes(term)
    );
  });

  const getPlanBadge = (plan: string) => {
    const p = (plan || 'Free').toLowerCase();
    if (p === 'gold') return <span className="badge" style={{ background: '#fefce8', color: '#9f7c2c', border: '1px solid #fef08a' }}>Gold Plan</span>;
    if (p === 'silver') return <span className="badge" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-900)', border: '1px solid var(--color-brand-200)' }}>Silver Plan</span>;
    if (p === 'bronze') return <span className="badge" style={{ background: '#fdf4ec', color: '#b87333', border: '1px solid #fed7aa' }}>Bronze Plan</span>;
    return <span className="badge badge-pending">Free Plan</span>;
  };

  return (
    <>
      <Head>
        <title>Manage Users — Admin</title>
      </Head>

      <AdminLayout
        title="Manage Platform Users"
        subtitle="Review registered accounts, subscription tiers, and connection metrics."
      >
        <div className="card" style={{ overflow: "hidden" }}>
          {/* Top Search */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: 280, flex: "1 1 300px" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or plan..."
                className="input input-sm"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 600 }}>
              Total: {filteredUsers.length} users
            </div>
          </div>

          {/* User Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-neutral-50)", borderBottom: "1px solid var(--border-subtle)" }}>
                  {["User", "Email", "Subscription Plan", "Applications (Month)", "Friends / Network", "Joined"].map((col) => (
                    <th key={col} style={{ padding: "12px 20px", textAlign: "left", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} style={{ padding: "16px 20px" }}><div className="skeleton" style={{ height: 28, borderRadius: "var(--radius-sm)" }} /></td></tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "var(--color-neutral-400)", fontSize: "var(--text-sm)" }}>
                      No registered users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => (
                    <tr
                      key={u._id || u.uid}
                      style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-50)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {u.photoURL ? (
                            <img src={u.photoURL} alt={u.displayName} style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", objectFit: "cover", flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                              {(u.displayName || "U").charAt(0)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>{u.displayName || "Unnamed User"}</div>
                            <div style={{ fontSize: "10px", color: "var(--color-neutral-400)", fontFamily: "monospace" }}>UID: {u.uid?.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 20px", fontSize: "var(--text-sm)", color: "var(--color-neutral-600)" }}>
                        {u.email || "No email"}
                      </td>

                      <td style={{ padding: "14px 20px" }}>
                        {getPlanBadge(u.plan)}
                      </td>

                      <td style={{ padding: "14px 20px", fontSize: "var(--text-sm)", color: "var(--color-neutral-800)", fontWeight: 600 }}>
                        {u.applicationsThisMonth || 0}
                      </td>

                      <td style={{ padding: "14px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-600)" }}>
                        {u.friends?.length || 0} connections
                      </td>

                      <td style={{ padding: "14px 20px", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : '—'}
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
