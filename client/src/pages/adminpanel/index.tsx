import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  FileText,
  Send,
  Users,
  BarChart,
  Settings,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/component/AdminLayout';
import Head from 'next/head';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Applications', value: '...', icon: <FileText size={22} />, color: 'var(--color-brand-900)', bg: 'var(--color-brand-100)' },
    { label: 'Active Jobs',        value: '...', icon: <Briefcase size={22} />, color: 'var(--color-success-700)', bg: 'var(--color-success-50)' },
    { label: 'Active Internships', value: '...', icon: <Send size={22} />,      color: 'var(--color-accent-700)', bg: 'var(--color-accent-100)' },
    { label: 'Registered Users',   value: '...', icon: <Users size={22} />,     color: 'var(--color-neutral-800)', bg: 'var(--color-neutral-100)' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const headers: Record<string, string> = token ? { 'x-admin-token': token } : {};
        const [appsRes, jobsRes, internshipsRes, usersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/application`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { headers }),
        ]);
        const [apps, jobs, internships, users] = await Promise.all([
          appsRes.json(), jobsRes.json(), internshipsRes.json(), usersRes.json()
        ]);
        setStats([
          { label: 'Total Applications', value: Array.isArray(apps) ? apps.length.toString() : '0', icon: <FileText size={22} />, color: 'var(--color-brand-900)', bg: 'var(--color-brand-100)' },
          { label: 'Active Jobs',        value: Array.isArray(jobs) ? jobs.length.toString() : '0', icon: <Briefcase size={22} />, color: 'var(--color-success-700)', bg: 'var(--color-success-50)' },
          { label: 'Active Internships', value: Array.isArray(internships) ? internships.length.toString() : '0', icon: <Send size={22} />, color: 'var(--color-accent-700)', bg: 'var(--color-accent-100)' },
          { label: 'Registered Users',   value: Array.isArray(users) ? users.length.toString() : '0', icon: <Users size={22} />, color: 'var(--color-neutral-800)', bg: 'var(--color-neutral-100)' },
        ]);
      } catch (e) { console.error('Failed to fetch stats', e); }
    };
    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Review Applications',
      description: 'Accept, reject or shortlist pending candidate applications.',
      icon: <FileText size={22} />,
      link: '/applications',
      badge: 'Priority'
    },
    {
      title: 'Post New Job',
      description: 'Create and publish full-time, hybrid, or remote job vacancies.',
      icon: <Briefcase size={22} />,
      link: '/postjob',
      badge: 'Action'
    },
    {
      title: 'Post Internship',
      description: 'Open internship positions for college students & freshers.',
      icon: <Send size={22} />,
      link: '/postinternship',
      badge: 'Action'
    },
    {
      title: 'Manage Platform Users',
      description: 'Review registered accounts, subscription tiers, and activity.',
      icon: <Users size={22} />,
      link: '/users',
      badge: 'System'
    },
    {
      title: 'Analytics & Insights',
      description: 'Visual metrics on applications, success rates, and user growth.',
      icon: <BarChart size={22} />,
      link: '/analytics',
      badge: 'Report'
    },
    {
      title: 'System Settings',
      description: 'Configure security parameters, contact emails, and limits.',
      icon: <Settings size={22} />,
      link: '/settings',
      badge: 'Config'
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard — InternArea</title>
      </Head>

      <AdminLayout
        title="Admin Control Center"
        subtitle="Manage jobs, internships, candidate applications, and platform operations."
      >
        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }} className="admin-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section title */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-neutral-900)", margin: 0 }}>Management Hub</h2>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", margin: "4px 0 0" }}>Select an operational module to execute administrator tasks.</p>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="admin-actions-grid">
          {quickActions.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card"
                style={{
                  padding: "24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.18s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-400)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 6 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)" }}>
                  Open Module <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </AdminLayout>

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
          .admin-actions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}