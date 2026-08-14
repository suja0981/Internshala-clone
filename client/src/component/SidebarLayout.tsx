import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  User,
  CreditCard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { href: "/profile",         label: "Dashboard",     icon: <LayoutDashboard size={18} /> },
  { href: "/userapplication", label: "My Applications", icon: <FileText size={18} /> },
  { href: "/job",             label: "Browse Jobs",   icon: <Briefcase size={18} /> },
  { href: "/internship",      label: "Internships",   icon: <Users size={18} /> },
  { href: "/profile",         label: "Profile",       icon: <User size={18} /> },
  { href: "/resume",          label: "Resume",        icon: <FileText size={18} /> },
  { href: "/pricing",         label: "Pricing",       icon: <CreditCard size={18} /> },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const router = useRouter();
  const user = useSelector(selectuser);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(href + "/");

  const handleLogout = () => signOut(auth);

  return (
    <div className="app-shell">
      {/* ─── SIDEBAR ────────────────────────────────────────── */}
      <aside
        style={{
          width: collapsed ? 68 : 240,
          flexShrink: 0,
          background: "var(--color-neutral-900)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 0.22s ease",
          zIndex: 10,
        }}
      >
        {/* Logo Row */}
        <div style={{
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 10,
        }}>
          {!collapsed && (
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 32, height: 32,
                background: "var(--color-brand-900)",
                borderRadius: "var(--radius-sm)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Briefcase size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: "var(--text-md)", color: "#fff" }}>
                Intern<span style={{ color: "var(--color-brand-400)" }}>Area</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <div style={{
              width: 32, height: 32,
              background: "var(--color-brand-900)",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Briefcase size={16} color="#fff" />
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
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* User Profile Mini */}
        {!collapsed && user && (
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <img
              src={user.photo || "/logo.png"}
              alt="Profile"
              style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", border: "2px solid rgba(255,255,255,0.12)", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name || "User"}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
            <button
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--color-neutral-500)", flexShrink: 0 }}
              aria-label="Notifications"
            >
              <Bell size={15} />
            </button>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {sidebarItems.map(item => {
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
                  padding: collapsed ? "10px" : "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  color: active ? "#fff" : "var(--color-neutral-400)",
                  background: active ? "var(--color-brand-900)" : "transparent",
                  textDecoration: "none",
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  position: "relative",
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
                {!collapsed && item.badge && (
                  <span style={{
                    marginLeft: "auto",
                    background: "var(--color-accent-500)",
                    color: "var(--color-neutral-950)",
                    borderRadius: "var(--radius-full)",
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px",
                    flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

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
              color: "var(--color-neutral-500)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "var(--text-sm)",
              fontWeight: 400,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(223,87,87,0.1)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-error-500)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-500)";
            }}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ───────────────────────────────────── */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
