import React, { useState } from "react";
import {
    Briefcase,
    Building2,
    MapPin,
    Tags,
    Users,
    IndianRupee,
    Calendar,
    Timer,
    Send
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import AdminLayout from "@/component/AdminLayout";
import Head from "next/head";

export default function PostInternship() {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        category: "",
        aboutCompany: "",
        aboutInternship: "",
        whoCanApply: "",
        perks: "",
        numberOfOpening: "",
        stipend: "",
        startDate: "",
        additionalInfo: "",
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
            toast.error("Please fill in all required details.");
            return;
        }
        try {
            setIsLoading(true);
            const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`, formData, {
              headers: { 'x-admin-token': token || '' }
            });
            toast.success("Internship opportunity posted successfully!");
            router.push("/adminpanel");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post internship.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Post Internship — Admin</title>
            </Head>

            <AdminLayout
                title="Post an Internship"
                subtitle="Publish a verified student or graduate internship opportunity."
            >
                <div className="card" style={{ maxWidth: 860, padding: "36px 32px" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Basic Details */}
                        <div>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <Send size={16} /> Basic Internship Information
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Internship Title *</label>
                                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="e.g. Data Science Intern" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Hiring Company *</label>
                                    <input required type="text" name="company" value={formData.company} onChange={handleChange} className="input" placeholder="e.g. Adobe, Microsoft" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Location / Mode *</label>
                                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className="input" placeholder="e.g. Remote / Mumbai" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Domain Category *</label>
                                    <input required type="text" name="category" value={formData.category} onChange={handleChange} className="input" placeholder="e.g. Web Development, Design, AI" />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Openings */}
                        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <Timer size={16} /> Stipend, Openings &amp; Timing
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="form-grid-3">
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Monthly Stipend *</label>
                                    <input required type="text" name="stipend" value={formData.stipend} onChange={handleChange} className="input" placeholder="e.g. ₹25,000 / month" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Start Date *</label>
                                    <input required type="text" name="startDate" value={formData.startDate} onChange={handleChange} className="input" placeholder="e.g. Immediate / Next Week" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Number of Openings *</label>
                                    <input required type="text" name="numberOfOpening" value={formData.numberOfOpening} onChange={handleChange} className="input" placeholder="e.g. 3" />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
                            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-brand-900)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                                Opportunity Details
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>About Company *</label>
                                    <textarea required rows={3} name="aboutCompany" value={formData.aboutCompany} onChange={handleChange} className="input" placeholder="Overview of company and engineering culture..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>About Internship / Day-to-Day *</label>
                                    <textarea required rows={3} name="aboutInternship" value={formData.aboutInternship} onChange={handleChange} className="input" placeholder="What the intern will learn and build..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Who Can Apply *</label>
                                    <textarea required rows={2} name="whoCanApply" value={formData.whoCanApply} onChange={handleChange} className="input" placeholder="Eligible degrees, graduation years, required skills..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Perks &amp; Certificate *</label>
                                    <textarea required rows={2} name="perks" value={formData.perks} onChange={handleChange} className="input" placeholder="Certificate of completion, Letter of recommendation, Pre-placement offer..." />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-700)", marginBottom: 6 }}>Additional Information *</label>
                                    <textarea required rows={2} name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className="input" placeholder="Working hours, flexible timing note, etc." />
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
                                {isLoading ? "Publishing Internship..." : "Publish Internship Opportunity →"}
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