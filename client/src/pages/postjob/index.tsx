import React, { useState } from "react";
import {
    Briefcase,
    Building2,
    MapPin,
    Tags,
    Users,
    IndianRupee,
    Calendar,
    Sparkles,
    Check
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import AdminLayout from "@/component/AdminLayout";
import Head from "next/head";

export default function PostJob() {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        category: "",
        aboutCompany: "",
        aboutJob: "",
        whoCanApply: "",
        perks: "",
        Experience: "",
        CTC: "",
        StartDate: "",
        AdditionalInfo: "",
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasEmptyFields = Object.values(formData).some((val) => !val.trim());
        if (hasEmptyFields) {
            toast.error("Please fill in all required fields.");
            return;
        }
        try {
            setIsLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/job`, formData, {
              headers: { 'x-admin-token': token || '' }
            });
            toast.success("Job published successfully!");
            router.push("/adminpanel");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post job. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Post New Job — Admin</title>
            </Head>

            <AdminLayout
                title="Post a Job Vacancy"
                subtitle="Create a verified full-time or hybrid job listing for job seekers."
            >
                <div className="card" style={{ maxWidth: 860, padding: "36px 32px" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Basic Details */}
                        <div>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <Briefcase size={16} /> Basic Job Info
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Job Title *</label>
                                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="e.g. Senior Frontend Developer" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Hiring Company *</label>
                                    <input required type="text" name="company" value={formData.company} onChange={handleChange} className="input" placeholder="e.g. Google, Swiggy, Razorpay" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Location *</label>
                                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className="input" placeholder="e.g. Bangalore / Remote" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Category / Domain *</label>
                                    <input required type="text" name="category" value={formData.category} onChange={handleChange} className="input" placeholder="e.g. Engineering, Design, Marketing" />
                                </div>
                            </div>
                        </div>

                        {/* Compensation & Experience */}
                        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <IndianRupee size={16} /> Compensation &amp; Requirements
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="form-grid-3">
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Annual CTC / Salary *</label>
                                    <input required type="text" name="CTC" value={formData.CTC} onChange={handleChange} className="input" placeholder="e.g. ₹12,00,000 / year" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Experience Required *</label>
                                    <input required type="text" name="Experience" value={formData.Experience} onChange={handleChange} className="input" placeholder="e.g. 2-4 Years" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Start Date *</label>
                                    <input required type="text" name="StartDate" value={formData.StartDate} onChange={handleChange} className="input" placeholder="e.g. Immediate / Next Month" />
                                </div>
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                                Detailed Descriptions
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>About Company *</label>
                                    <textarea required rows={3} name="aboutCompany" value={formData.aboutCompany} onChange={handleChange} className="input" placeholder="Brief overview of company culture and mission..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>About the Job / Responsibilities *</label>
                                    <textarea required rows={3} name="aboutJob" value={formData.aboutJob} onChange={handleChange} className="input" placeholder="Key responsibilities and duties in this role..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Who Can Apply / Requirements *</label>
                                    <textarea required rows={2} name="whoCanApply" value={formData.whoCanApply} onChange={handleChange} className="input" placeholder="Required qualifications, skills, and eligibility..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Perks &amp; Benefits *</label>
                                    <textarea required rows={2} name="perks" value={formData.perks} onChange={handleChange} className="input" placeholder="e.g. Health Insurance, Flexible Hours, Equity..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Additional Information *</label>
                                    <textarea required rows={2} name="AdditionalInfo" value={formData.AdditionalInfo} onChange={handleChange} className="input" placeholder="Hybrid schedule note, interview stages, etc." />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 24 }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary"
                                style={{ width: "100%", padding: "14px 0", fontSize: "var(--text-md)" }}
                            >
                                {isLoading ? "Publishing Job..." : "Publish Job Opportunity →"}
                            </button>
                        </div>
                    </form>
                </div>
            </AdminLayout>

            <style>{`
                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr !important; }
                    .form-grid-3 { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}