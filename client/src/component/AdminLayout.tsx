import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Send,
  Users,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  ArrowUpRight
} from "lucide-react";

interface AdminSidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminSidebarItems: AdminSidebarItem[] = [
  { href: "/adminpanel",      label: "Dashboard",       icon: <LayoutDashboard size={18} /> },
  { href: "/applications",    label: "Applications",    icon: <FileText size={18} /> },
  { href: "/postjob",         label: "Post Job",        icon: <Briefcase size={18} /> },
  { href: "/postinternship",  label: "Post Internship", icon: <Send size={18} /> },
  { href: "/users",           label: "Manage Users",    icon: <Users size={18} /> },
  { href: "/analytics",       label: "Analytics",       icon: <BarChart size={18} /> },
  { href: "/settings",        label: "Settings",        icon: <Settings size={18} /> },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) {
      router.replace('/adminlogin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const isActive = (href: string) => router.pathname === href;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/adminlogin');
  };

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-neutral-950)" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "var(--color-brand-400)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-shell" style={{ background: "var(--color-background)" }}>
      {/* ─── ADMIN SIDEBAR ────────────────────────────────────────── */}
      <aside
        style={{
          width: collapsed ? 68 : 240,
          flexShrink: 0,
          background: "var(--color-neutral-950)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 0.22s ease",
          zIndex: 10,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 10,
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32,
                background: "var(--color-brand-800)",
                borderRadius: "var(--radius-sm)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Shield size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "var(--text-md)", color: "#fff" }}>
                Admin<span style={{ color: "var(--color-brand-400)" }}>Panel</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: 32, height: 32,
              background: "var(--color-brand-800)",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={16} color="#fff" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 24, height: 24,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "var(--radius-full)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-neutral-400)",
              flexShrink: 0,
            }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation items */}
        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {adminSidebarItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? 0 : 12,
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px" : "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  color: active ? "#fff" : "var(--color-neutral-400)",
                  background: active ? "var(--color-brand-900)" : "transparent",
                  textDecoration: "none",
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)";
                  }
                }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Public Site Link */}
        <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: "8px 12px",
              color: "var(--color-brand-400)",
              fontSize: "var(--text-xs)",
              textDecoration: "none",
              borderRadius: "var(--radius-sm)",
              fontWeight: 500
            }}
          >
            <ArrowUpRight size={14} style={{ flexShrink: 0 }} />
            {!collapsed && <span>View Main Website</span>}
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 12,
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
              padding: collapsed ? "10px" : "10px 12px",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-neutral-400)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "var(--text-sm)",
              fontWeight: 400,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(223,87,87,0.12)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-error-400)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-400)";
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN ADMIN CONTENT ───────────────────────────────────── */}
      <main className="main-content" style={{ padding: "32px 40px", minHeight: "100vh" }}>
        {title && (
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-neutral-900)", marginBottom: 4 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
