import axios from "axios";
import { User, Lock, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken')) {
      router.push("/adminpanel");
    }
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all details");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/adminlogin`,
        formData
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', res.data.token);
      }
      toast.success("Welcome back, Administrator!");
      router.push("/adminpanel");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials. Please verify your admin username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Portal — InternArea</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        background: "var(--color-neutral-950)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 16px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow orb */}
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "var(--color-brand-900)", opacity: 0.3, filter: "blur(120px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: "var(--radius-lg)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--color-brand-400)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <Shield size={28} />
            </div>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              Administrator Portal
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-400)", lineHeight: 1.5 }}>
              Sign in with authorized administrative credentials to manage opportunities and users.
            </p>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-xl)",
            padding: "32px 28px",
            boxShadow: "var(--shadow-2xl)",
            backdropFilter: "blur(12px)"
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label htmlFor="username" style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-300)", marginBottom: 6 }}>
                  Admin Username
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }}>
                    <User size={16} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: "var(--radius-md)",
                      color: "#fff",
                      fontSize: "var(--text-sm)",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-300)", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }}>
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 38px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: "var(--radius-md)",
                      color: "#fff",
                      fontSize: "var(--text-sm)",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px 0", marginTop: 6 }}
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Dashboard →'}
              </button>

              <div style={{ textAlign: "center", marginTop: 4 }}>
                <Link href="/" style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <ArrowLeft size={13} /> Return to Main Website
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;