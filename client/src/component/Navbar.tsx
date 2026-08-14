import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, provider } from "../firebase/firebase";
import {
  ChevronDown, Globe, X, Menu, Eye, EyeOff,
  Mail, Lock, User as UserIcon, Briefcase, Shield,
} from "lucide-react";
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import Head from "next/head";

type GoogleTranslateWindow = Window & { googleTranslateElementInit?: () => void };

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "zh-CN", name: "Chinese" },
  { code: "fr", name: "French" },
];

const navLinks = [
  { href: "/job", label: "Jobs" },
  { href: "/internship", label: "Internships" },
  { href: "/public-space", label: "Community" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resume", label: "Resume" },
];

const Navbar = () => {
  const user = useSelector(selectuser);
  const router = useRouter();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth Modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Chrome OTP
  const [isChromeOtpModalOpen, setIsChromeOtpModalOpen] = useState(false);
  const [chromeOtp, setChromeOtp] = useState("");
  const [loginRecordId, setLoginRecordId] = useState("");
  const [pendingUserUid, setPendingUserUid] = useState("");

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Google Translate init
  useEffect(() => {
    (window as GoogleTranslateWindow).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,es,hi,pt,zh-CN,fr", autoDisplay: false },
        "google_translate_element"
      );
    };
  }, []);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthEmail(""); setAuthPassword(""); setAuthName("");
    setShowPassword(false);
    setIsAuthOpen(true);
    setIsMobileOpen(false);
  };

  const triggerTranslation = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) { select.value = langCode; select.dispatchEvent(new Event("change")); }
    setCurrentLang(langCode);
    setIsLangOpen(false);
  };

  const handleLanguageSelect = (langCode: string) => triggerTranslation(langCode);

  const trackLogin = async (currentUser: any) => {
    const ua = navigator.userAgent;
    const browser = /Chrome/i.test(ua) && !/Edge|Edg/i.test(ua) ? "Chrome" :
      /Firefox/i.test(ua) ? "Firefox" :
      /Safari/i.test(ua) && !/Chrome/i.test(ua) ? "Safari" : "Other";
    const os = /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "MacOS" :
      /Linux/i.test(ua) ? "Linux" : /Android/i.test(ua) ? "Android" :
      /iOS|iPhone|iPad/i.test(ua) ? "iOS" : "Other";
    const deviceType = /Mobile|Android|iP(hone|od|ad)/i.test(ua) ? "Mobile" : "Desktop";
    let ipAddress = "Unknown";
    try { const r = await axios.get("https://api.ipify.org?format=json"); ipAddress = r.data.ip; } catch {}

    const trackRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/track-login`, {
      uid: currentUser.uid, email: currentUser.email, browser, os, deviceType, ipAddress,
    });

    if (trackRes.status === 202) {
      setLoginRecordId(trackRes.data.recordId);
      setPendingUserUid(currentUser.uid);
      setIsChromeOtpModalOpen(true);
    } else {
      toast.success(authMode === "register" ? "Account created successfully!" : "Logged in successfully!");
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthOpen(false);
    try {
      const result = await signInWithPopup(auth, provider);
      await trackLogin(result.user).catch(() => signOut(auth));
    } catch (error: any) {
      signOut(auth);
      toast.error(error.response?.data?.error || "Google login failed");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) { toast.error("Please fill in all fields"); return; }
    setAuthLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setIsAuthOpen(false);
      await trackLogin(result.user).catch(() => signOut(auth));
    } catch (error: any) {
      const code = error.code;
      if (code === "auth/user-not-found") toast.error("No account found. Please create one.");
      else if (code === "auth/wrong-password" || code === "auth/invalid-credential") toast.error("Incorrect password.");
      else if (code === "auth/invalid-email") toast.error("Invalid email address.");
      else toast.error("Login failed. Please try again.");
    } finally { setAuthLoading(false); }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail || !authPassword) { toast.error("Please fill in all fields"); return; }
    if (authPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setAuthLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      await updateProfile(result.user, { displayName: authName.trim() });
      setIsAuthOpen(false);
      await trackLogin(result.user).catch(() => signOut(auth));
    } catch (error: any) {
      const code = error.code;
      if (code === "auth/email-already-in-use") toast.error("An account with this email already exists.");
      else if (code === "auth/invalid-email") toast.error("Invalid email address.");
      else if (code === "auth/weak-password") toast.error("Password is too weak.");
      else toast.error("Registration failed. Please try again.");
    } finally { setAuthLoading(false); }
  };

  const handleVerifyChromeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login-otp`, {
        uid: pendingUserUid, otp: chromeOtp, recordId: loginRecordId,
      });
      toast.success("Login Verified!");
      setIsChromeOtpModalOpen(false);
    } catch (err: any) { toast.error(err.response?.data?.error || "Invalid OTP"); }
  };

  const handleLogout = () => { signOut(auth); };

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <>
      <Head>
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
        <style>{`
          .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
          body { top: 0px !important; }
          #google_translate_element { display: none !important; }
        `}</style>
      </Head>

      <div id="google_translate_element" />

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-header)" as any,
          padding: "10px 24px",
          transition: "box-shadow 0.25s ease",
          background: "rgba(249, 250, 248, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
          boxShadow: isScrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div style={{ maxWidth: "var(--container-2xl)", margin: "0 auto", display: "flex", alignItems: "center", gap: 32 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--color-brand-900)",
              borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Briefcase size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--color-neutral-900)", lineHeight: 1 }}>
                Intern<span style={{ color: "var(--color-brand-900)" }}>Area</span>
              </span>
              <div style={{ fontSize: 10, color: "var(--color-neutral-500)", fontWeight: 500, letterSpacing: "0.04em" }}>
                Find. Learn. Grow.
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }} className="hidden md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: isActive(link.href) ? "var(--color-brand-900)" : "var(--color-neutral-700)",
                  background: isActive(link.href) ? "var(--color-brand-100)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-100)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-900)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.href)) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-700)";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>

            {/* Language Dropdown */}
            <div style={{ position: "relative" }} className="hidden md:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-default)",
                  background: "var(--color-surface)",
                  color: "var(--color-neutral-600)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Globe size={14} />
                <span style={{ textTransform: "uppercase" }}>{currentLang.slice(0, 2)}</span>
                <ChevronDown size={12} />
              </button>
              {isLangOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-md)",
                  zIndex: "var(--z-dropdown)" as any,
                  minWidth: 140, overflow: "hidden",
                }}>
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 16px",
                        fontSize: "var(--text-sm)",
                        color: currentLang === lang.code ? "var(--color-brand-900)" : "var(--color-neutral-700)",
                        background: currentLang === lang.code ? "var(--color-brand-50)" : "transparent",
                        fontWeight: currentLang === lang.code ? 600 : 400,
                        cursor: "pointer",
                        border: "none",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-50)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = currentLang === lang.code ? "var(--color-brand-50)" : "transparent"; }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth / Profile */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  <img
                    src={user.photo || "/logo.png"}
                    alt="Profile"
                    style={{ width: 34, height: 34, borderRadius: "var(--radius-full)", border: "2px solid var(--border-default)", objectFit: "cover" }}
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm hidden md:inline-flex"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => openAuth("login")}
                  className="btn btn-ghost btn-sm hidden md:inline-flex"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="btn btn-primary btn-sm"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-default)",
                background: "var(--color-surface)",
                color: "var(--color-neutral-700)",
                cursor: "pointer",
              }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div style={{
            marginTop: 10,
            borderTop: "1px solid var(--border-default)",
            padding: "16px 0 8px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: isActive(link.href) ? "var(--color-brand-900)" : "var(--color-neutral-700)",
                  background: isActive(link.href) ? "var(--color-brand-100)" : "transparent",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ padding: "12px 16px 4px", borderTop: "1px solid var(--border-subtle)", marginTop: 8, display: "flex", gap: 10 }}>
              {user ? (
                <>
                  <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flex: 1 }}>
                    <img src={user.photo || "/logo.png"} alt="Profile" style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", border: "2px solid var(--border-default)" }} />
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-neutral-900)" }}>{user.name}</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMobileOpen(false); }} className="btn btn-outline btn-sm">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => openAuth("login")} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Log in</button>
                  <button onClick={() => openAuth("register")} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Sign up</button>
                </>
              )}
            </div>
            <Link href="/adminlogin" onClick={() => setIsMobileOpen(false)} style={{ padding: "6px 16px", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", textDecoration: "none" }}>
              Admin Login
            </Link>
          </div>
        )}
      </header>

      {/* ─── AUTH MODAL ─────────────────────────────────────── */}
      {isAuthOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: "var(--z-modal)" as any,
            background: "rgba(20, 33, 36, 0.5)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={e => { if (e.target === e.currentTarget) setIsAuthOpen(false); }}
        >
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            width: "100%", maxWidth: 440,
            overflow: "hidden",
            animation: "fade-in-up 0.3s ease-out forwards",
          }}>
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-700) 100%)",
              padding: "28px 32px 24px",
              position: "relative",
            }}>
              <button
                onClick={() => setIsAuthOpen(false)}
                style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "var(--radius-full)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
              >
                <X size={14} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.15)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={16} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: "var(--text-md)", color: "#fff" }}>InternArea</span>
              </div>
              <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {authMode === "login" ? "Welcome back" : "Get started today"}
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.75)", marginTop: 6 }}>
                {authMode === "login" ? "Sign in to your account" : "Create your free account in seconds"}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)" }}>
              {(["login", "register"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  style={{
                    flex: 1, padding: "12px 0",
                    fontSize: "var(--text-sm)", fontWeight: 600,
                    color: authMode === mode ? "var(--color-brand-900)" : "var(--color-neutral-500)",
                    background: "transparent", border: "none",
                    borderBottom: authMode === mode ? "2px solid var(--color-brand-900)" : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <div style={{ padding: "24px 32px 28px" }}>
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "11px 16px",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  fontSize: "var(--text-sm)", fontWeight: 500,
                  color: "var(--color-neutral-800)",
                  cursor: "pointer", marginBottom: 20, transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-neutral-50)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface)"; }}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" style={{ width: 18, height: 18 }} alt="Google" />
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", fontWeight: 500 }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={authMode === "login" ? handleEmailLogin : handleEmailRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {authMode === "register" && (
                  <div style={{ position: "relative" }}>
                    <UserIcon size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                    <input type="text" placeholder="Full Name" value={authName} onChange={e => setAuthName(e.target.value)} required
                      className="input" style={{ paddingLeft: 36 }} />
                  </div>
                )}
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                  <input type="email" placeholder="Email address" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                    className="input" style={{ paddingLeft: 36 }} />
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={authMode === "register" ? "Password (min. 6 chars)" : "Password"}
                    value={authPassword} onChange={e => setAuthPassword(e.target.value)} required
                    className="input" style={{ paddingLeft: 36, paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-neutral-400)" }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {authMode === "login" && (
                  <div style={{ textAlign: "right", marginTop: -6 }}>
                    <Link href="/forgot-password" style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-900)", fontWeight: 500 }}>Forgot password?</Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-primary"
                  style={{ marginTop: 4 }}
                >
                  {authLoading ? (
                    <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Processing...</>
                  ) : authMode === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginTop: 20 }}>
                {authMode === "login" ? (
                  <>Don't have an account?{" "}
                    <button onClick={() => setAuthMode("register")} style={{ color: "var(--color-brand-900)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Sign up free</button>
                  </>
                ) : (
                  <>Already have an account?{" "}
                    <button onClick={() => setAuthMode("login")} style={{ color: "var(--color-brand-900)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Sign in</button>
                  </>
                )}
              </p>

              <Link href="/adminlogin" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, padding: "8px", borderRadius: "var(--radius-sm)", background: "var(--color-neutral-50)", fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500, textDecoration: "none" }}>
                <Shield size={13} /> Admin login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── CHROME OTP MODAL ────────────────────────────────── */}
      {isChromeOtpModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "var(--color-surface)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 420, width: "100%", background: "var(--color-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", padding: "40px 36px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "var(--color-brand-100)", borderRadius: "var(--radius-full)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Shield size={26} color="var(--color-brand-900)" />
            </div>
            <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 8 }}>Security Verification</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-600)", marginBottom: 28, lineHeight: 1.6 }}>
              A Chrome login was detected. Enter the 6-digit OTP sent to your registered email to continue.
            </p>
            <form onSubmit={handleVerifyChromeOtp}>
              <input
                type="text" maxLength={6} required value={chromeOtp}
                onChange={e => setChromeOtp(e.target.value)}
                placeholder="• • • • • •"
                style={{
                  width: "100%", border: "2px solid var(--border-default)",
                  borderRadius: "var(--radius-md)", padding: "14px",
                  textAlign: "center", fontSize: "var(--text-2xl)",
                  letterSpacing: "0.3em", fontWeight: 700,
                  color: "var(--color-neutral-900)", marginBottom: 16,
                  outline: "none", transition: "border-color 0.15s",
                  fontFamily: "monospace",
                }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--border-focus)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border-default)"; }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Verify &amp; Continue
              </button>
            </form>
            <button
              onClick={() => { signOut(auth); setIsChromeOtpModalOpen(false); }}
              style={{ marginTop: 16, fontSize: "var(--text-sm)", color: "var(--color-error-500)", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
            >
              Cancel Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
