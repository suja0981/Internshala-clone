import React, { useEffect } from "react";
import { Settings, Save, Shield, Bell, Globe, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "@/component/AdminLayout";
import Head from "next/head";

export default function AdminSettings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform settings saved successfully!");
  };

  return (
    <>
      <Head>
        <title>Settings — Admin</title>
      </Head>

      <AdminLayout
        title="Platform Settings"
        subtitle="Manage global system preferences, notifications, and security rules."
      >
        <div className="card" style={{ maxWidth: 760, padding: "32px" }}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* General System Config */}
            <div>
              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Globe size={16} /> General Platform Config
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="settings-grid">
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Platform Brand Name</label>
                  <input type="text" defaultValue="InternArea" className="input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Support Contact Email</label>
                  <input type="email" defaultValue="support@internarea.com" className="input" />
                </div>
              </div>
            </div>

            {/* Application Security & Limits */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 24 }}>
              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={16} /> Subscription Application Limits
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="settings-grid-3">
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Free Tier (Apps/Mo)</label>
                  <input type="number" defaultValue={1} className="input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Bronze Tier (Apps/Mo)</label>
                  <input type="number" defaultValue={3} className="input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Silver Tier (Apps/Mo)</label>
                  <input type="number" defaultValue={5} className="input" />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 24 }}>
              <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={16} /> Notifications &amp; Alerts
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--color-brand-900)", width: 16, height: 16 }} />
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)" }}>Send email notifications when new candidates apply</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--color-brand-900)", width: 16, height: 16 }} />
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)" }}>Alert admins when subscription upgrades occur</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 28px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Save size={16} /> Save Configurations
              </button>
            </div>

          </form>
        </div>
      </AdminLayout>

      <style>{`
        @media (max-width: 640px) {
          .settings-grid { grid-template-columns: 1fr !important; }
          .settings-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
