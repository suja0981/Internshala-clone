import axios from "axios";
import { KeyRound, Mail, Phone, Copy, Check, AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [rateLimitMsg, setRateLimitMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const isPhoneInput = /^[0-9]+$/.test(identifier.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = identifier.trim();
    if (!trimmed) {
      toast.error("Please enter your email or phone number.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isPhone = /^[0-9]{7,15}$/.test(trimmed);
    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email address or phone number (digits only).");
      return;
    }

    setNewPassword("");
    setRateLimitMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        { identifier: trimmed }
      );
      toast.success(res.data.message);
      setNewPassword(res.data.newPassword);
    } catch (error: any) {
      const status = error.response?.status;
      const msg = error.response?.data?.error || "An error occurred. Please try again.";

      if (status === 429) {
        setRateLimitMsg(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <>
      <Head>
        <title>Reset Password — InternArea</title>
      </Head>

      <div style={{
        minHeight: "100vh",
        background: "var(--color-background)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 16px"
      }}>
        <div style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: "var(--radius-lg)",
              background: "var(--color-brand-100)",
              color: "var(--color-brand-900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <KeyRound size={26} />
            </div>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-neutral-900)", marginBottom: 6 }}>
              Forgot Password?
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", lineHeight: 1.5 }}>
              Enter your registered email or phone number. We'll generate a secure temporary password.
            </p>
          </div>

          <div className="card" style={{ padding: "32px 28px", boxShadow: "var(--shadow-md)" }}>
            {/* Daily limit warning */}
            {rateLimitMsg && (
              <div style={{
                display: "flex", gap: 10,
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-warning-50)",
                border: "1px solid var(--color-warning-200)",
                color: "var(--color-warning-800)",
                marginBottom: 20,
                fontSize: "var(--text-xs)"
              }}>
                <AlertTriangle size={16} color="var(--color-warning-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Daily Limit Reached</strong>
                  <div style={{ marginTop: 2 }}>{rateLimitMsg}</div>
                </div>
              </div>
            )}

            {newPassword ? (
              /* Success State */
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-success-50)", color: "var(--color-success-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <ShieldCheck size={26} />
                </div>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 4 }}>Password Generated!</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginBottom: 20 }}>
                  Copy your new password below and use it to log in immediately.
                </p>

                <div style={{
                  position: "relative",
                  background: "var(--color-neutral-900)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 44px 16px 16px",
                  marginBottom: 16
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: "var(--text-xl)", letterSpacing: "0.15em", color: "var(--color-success-400)", fontWeight: 700, wordBreak: "break-all" }}>
                    {newPassword}
                  </span>
                  <button
                    onClick={handleCopy}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "var(--radius-sm)",
                      padding: 6, color: copied ? "var(--color-success-400)" : "#fff", cursor: "pointer"
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: 12 }}
                >
                  {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Password</>}
                </button>

                <Link href="/" className="btn btn-outline" style={{ width: "100%" }}>
                  <ArrowLeft size={14} /> Return to Home / Login
                </Link>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label htmlFor="identifier" style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>
                    Email or Phone Number
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }}>
                      {isPhoneInput && identifier.length > 0 ? <Phone size={16} /> : <Mail size={16} />}
                    </div>
                    <input
                      id="identifier"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (rateLimitMsg) setRateLimitMsg("");
                      }}
                      placeholder="e.g. user@example.com or 9876543210"
                      className="input"
                      style={{ paddingLeft: 38 }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", color: "var(--color-brand-900)" }}>
                  <ShieldCheck size={15} style={{ flexShrink: 0 }} />
                  <span>You can request a password reset <strong>once per day</strong> per account.</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "12px 0" }}
                >
                  {isLoading ? 'Generating...' : 'Reset My Password'}
                </button>

                <div style={{ textAlign: "center", marginTop: 4 }}>
                  <Link href="/" style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <ArrowLeft size={13} /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
