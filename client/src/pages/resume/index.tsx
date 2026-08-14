import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { auth, storage } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FileText, Upload, Lock, Briefcase, GraduationCap, User as UserIcon, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SidebarLayout from '@/component/SidebarLayout';
import Link from 'next/link';

export default function ResumeBuilder() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [dbUser, setDbUser] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        qualifications: '',
        experience: '',
        personalInfo: ''
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const [otp, setOtp] = useState('');
    const [existingResume, setExistingResume] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL
                    });
                    setDbUser(res.data);
                    
                    // Fetch existing resume if any
                    const resumeRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/${currentUser.uid}`);
                    if (resumeRes.data) {
                        setExistingResume(resumeRes.data);
                        setStep(5); // Go directly to preview if already generated
                    }
                } catch (error: any) {
                    if (error.response?.status !== 404) {
                        console.error("Error fetching data", error);
                    }
                }
            } else {
                router.push('/');
            }
        });

        return () => {
            unsubscribe();
        };
    }, [router]);

    if (!dbUser) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background)" }}>
                <div style={{ width: 36, height: 36, border: "3px solid var(--color-brand-200)", borderTopColor: "var(--color-brand-900)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (dbUser.plan === 'Free') {
        return (
            <SidebarLayout>
                <div style={{ padding: "48px 32px", minHeight: "100vh", background: "var(--color-background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="card" style={{ maxWidth: 500, padding: "40px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-brand-50)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                            <Lock size={32} />
                        </div>
                        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-neutral-900)", marginBottom: 8 }}>
                            Resume Builder is Locked
                        </h1>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", lineHeight: 1.6, marginBottom: 24 }}>
                            The Professional Resume Builder is an exclusive feature for our members on Bronze, Silver, or Gold plans.
                        </p>
                        <Link href="/pricing" className="btn btn-primary" style={{ width: "100%" }}>
                            Upgrade to Premium Plan →
                        </Link>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e: any) => {
        if (e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleGenerateOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/send-otp`, { uid: user.uid });
            toast.success(res.data.message);
            setStep(2);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndPay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return toast.error("Enter OTP");
        
        setIsLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/verify-and-order`, { 
                uid: user.uid, 
                otp 
            });
            const { order } = res.data;

            let photoUrl = '';
            if (photoFile) {
                toast.info("Uploading photo, please wait...");
                const storageRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${photoFile.name}`);
                await uploadBytes(storageRef, photoFile);
                photoUrl = await getDownloadURL(storageRef);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: order.amount,
                currency: order.currency,
                name: 'InternArea',
                description: `Professional Resume Generation (₹50)`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature || 'mock_signature',
                            uid: user.uid,
                            resumeData: { ...formData, photoUrl }
                        });
                        
                        toast.success(verifyRes.data.message);
                        setExistingResume(verifyRes.data.resume);
                        setStep(5);
                    } catch (err: any) {
                        toast.error(err.response?.data?.error || "Error saving resume to database.");
                    }
                },
                prefill: {
                    name: formData.fullName || user.displayName || 'User',
                    email: formData.email || user.email || 'user@example.com'
                },
                theme: { color: '#1F5F66' },
                modal: {
                    ondismiss: () => toast.info('Payment cancelled.')
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Verification or Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Resume Builder — InternArea</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
            </Head>

            <SidebarLayout>
                <div style={{ padding: "32px", minHeight: "100vh", background: "var(--color-background)" }}>

                    {step < 5 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "var(--color-brand-100)", color: "var(--color-brand-900)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 8 }}>
                                <Sparkles size={13} /> ATS-Friendly Format
                            </div>
                            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-neutral-900)", marginBottom: 4 }}>
                                Professional Resume Builder
                            </h1>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>
                                Generate an ATS-compliant resume attached directly to all your applications.
                            </p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="card" style={{ maxWidth: 760, padding: "32px" }}>
                            <form onSubmit={handleGenerateOTP} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="resume-grid">
                                    <div>
                                        <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Full Name *</label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Email *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="e.g. john@example.com" />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Phone Number *</label>
                                        <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="e.g. +91 98765 43210" />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Profile Photo</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-md)", color: "var(--color-brand-900)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
                                                <Upload size={14} /> Upload Photo
                                                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                                            </label>
                                            {photoPreview && <img src={photoPreview} alt="Preview" style={{ width: 38, height: 38, borderRadius: "var(--radius-full)", objectFit: "cover", border: "2px solid var(--color-brand-200)" }} />}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Educational Qualifications *</label>
                                    <textarea required name="qualifications" value={formData.qualifications} onChange={handleChange} rows={3} className="input" placeholder="e.g. B.Tech in Computer Science, ABC University, 2021-2025..." style={{ resize: "vertical" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Experience &amp; Skills *</label>
                                    <textarea required name="experience" value={formData.experience} onChange={handleChange} rows={3} className="input" placeholder="e.g. Frontend Developer Intern at TechCorp. Skills: React, TypeScript, Node.js, SQL..." style={{ resize: "vertical" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Personal Info / Summary *</label>
                                    <textarea required name="personalInfo" value={formData.personalInfo} onChange={handleChange} rows={2} className="input" placeholder="Brief professional summary highlight your career aspirations..." style={{ resize: "vertical" }} />
                                </div>

                                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ padding: "12px 0", marginTop: 8 }}>
                                    {isLoading ? 'Processing...' : 'Proceed to Verification (₹50) →'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card" style={{ maxWidth: 440, margin: "40px auto 0", padding: "36px 28px", textAlign: "center" }}>
                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                <Lock size={24} />
                            </div>
                            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 800, color: "var(--color-neutral-900)", marginBottom: 6 }}>Verify Your Email</h2>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", marginBottom: 20 }}>
                                We've sent a 6-digit OTP to your registered email to confirm authorization.
                            </p>
                            <form onSubmit={handleVerifyAndPay} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    className="input"
                                    style={{ textAlign: "center", letterSpacing: "0.2em", fontSize: "var(--text-xl)", fontWeight: 700, fontFamily: "monospace" }}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ padding: "12px 0" }}>
                                    {isLoading ? 'Verifying...' : 'Verify OTP & Pay ₹50'}
                                </button>
                            </form>
                            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--color-neutral-500)", fontSize: "var(--text-xs)", marginTop: 14, cursor: "pointer" }}>
                                ← Back to Edit Information
                            </button>
                        </div>
                    )}

                    {step === 5 && existingResume && (
                        <div style={{ maxWidth: 840 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-neutral-900)", margin: 0 }}>Your Verified Resume</h2>
                                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", margin: "4px 0 0" }}>This resume is automatically included when you apply to positions.</p>
                                </div>
                                <span className="badge badge-approved" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <Check size={12} /> Active &amp; Attached
                                </span>
                            </div>

                            {/* Resume Paper Preview */}
                            <div className="card" style={{ padding: "40px", background: "#fff", borderTop: "6px solid var(--color-brand-900)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 24, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 24, marginBottom: 28 }}>
                                    {existingResume.photoUrl ? (
                                        <img src={existingResume.photoUrl} alt="Profile" style={{ width: 84, height: 84, borderRadius: "var(--radius-full)", objectFit: "cover", border: "3px solid var(--border-default)" }} />
                                    ) : (
                                        <div style={{ width: 84, height: 84, borderRadius: "var(--radius-full)", background: "var(--color-brand-100)", color: "var(--color-brand-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <UserIcon size={36} />
                                        </div>
                                    )}
                                    <div>
                                        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-neutral-900)", margin: 0 }}>{existingResume.fullName}</h1>
                                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)", marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
                                            <span>{existingResume.email}</span> • <span>{existingResume.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div>
                                        <h3 style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--color-brand-100)", paddingBottom: 6, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                                            <UserIcon size={14} /> Profile Summary
                                        </h3>
                                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.7, margin: 0 }}>{existingResume.personalInfo}</p>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--color-brand-100)", paddingBottom: 6, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                                            <GraduationCap size={14} /> Education &amp; Qualifications
                                        </h3>
                                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{existingResume.qualifications}</p>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--color-brand-100)", paddingBottom: 6, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                                            <Briefcase size={14} /> Experience &amp; Skills
                                        </h3>
                                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{existingResume.experience}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </SidebarLayout>

            <style>{`
                @media (max-width: 640px) {
                    .resume-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
