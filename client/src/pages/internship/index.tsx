import axios from "axios";
import { Filter, X, MapPin, Search, SlidersHorizontal, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import JobCard, { JobCardProps } from "@/component/JobCard";

const DURATION_OPTS = ["1-2 Months", "3 Months", "6 Months", "1 Year"];
const LOCATIONS = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Remote"];
const CATEGORIES = ["Engineering", "Design", "Data Science", "Marketing", "Finance", "Management"];

interface Filters {
  category: string;
  location: string;
  duration: string;
  workFromHome: boolean;
}

const defaultFilters: Filters = { category: "", location: "", duration: "", workFromHome: false };

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "5px 0" }}>
      <div
        style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 4, border: checked ? "none" : "1.5px solid var(--border-strong)", background: checked ? "var(--color-brand-900)" : "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}
        onClick={onChange}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-700)" }}>{label}</span>
    </label>
  );
}

export default function InternshipsPage() {
  const [allInternships, setAllInternships] = useState<any[]>([]);
  const [filtered, setFiltered]             = useState<any[]>([]);
  const [filters, setFilters]               = useState<Filters>(defaultFilters);
  const [searchQuery, setSearchQuery]       = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading]               = useState(true);
  const [activeFilters, setActiveFilters]   = useState<string[]>([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`);
        setAllInternships(Array.isArray(res.data) ? res.data : []);
        setFiltered(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const result = allInternships.filter((item: any) => {
      const matchSearch = !q ||
        (item.title || "").toLowerCase().includes(q) ||
        (item.company || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q);
      const matchCat = !filters.category || (item.category || "").toLowerCase().includes(filters.category.toLowerCase());
      const matchLoc = !filters.location || (item.location || "").toLowerCase().includes(filters.location.toLowerCase());
      const matchDur = !filters.duration || (item.duration || "").includes(filters.duration);
      const matchWFH = !filters.workFromHome || (item.workMode || item.location || "").toLowerCase().includes("remote");
      return matchSearch && matchCat && matchLoc && matchDur && matchWFH;
    });
    setFiltered(result);

    const chips: string[] = [];
    if (filters.category) chips.push(filters.category);
    if (filters.location) chips.push(filters.location);
    if (filters.duration) chips.push(filters.duration);
    if (filters.workFromHome) chips.push("Remote");
    setActiveFilters(chips);
  }, [filters, allInternships, searchQuery]);

  const clearFilters = () => { setFilters(defaultFilters); setSearchQuery(""); };

  const removeChip = (chip: string) => {
    setFilters(prev => ({
      ...prev,
      category:    prev.category    === chip ? "" : prev.category,
      location:    prev.location    === chip ? "" : prev.location,
      duration:    prev.duration    === chip ? "" : prev.duration,
      workFromHome: chip === "Remote" ? false : prev.workFromHome,
    }));
  };

  const cards: JobCardProps[] = filtered.map((item: any) => ({
    _id: item._id,
    title: item.title,
    company: item.company,
    location: item.location,
    workMode: item.workMode,
    jobType: "Internship" as const,
    duration: item.duration,
    stipend: item.stipend,
    category: item.category,
    variant: "compact" as const,
  }));

  const FilterPanel = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={16} color="var(--color-brand-900)" />
          <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-neutral-900)" }}>Filters</span>
        </div>
        <button onClick={clearFilters} style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-900)", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>Clear all</button>
      </div>

      <FilterSection title="Category">
        {CATEGORIES.map(cat => (
          <FilterCheckbox key={cat} label={cat} checked={filters.category === cat}
            onChange={() => setFilters(f => ({ ...f, category: f.category === cat ? "" : cat }))} />
        ))}
      </FilterSection>

      <FilterSection title="Duration">
        {DURATION_OPTS.map(dur => (
          <FilterCheckbox key={dur} label={dur} checked={filters.duration === dur}
            onChange={() => setFilters(f => ({ ...f, duration: f.duration === dur ? "" : dur }))} />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        {LOCATIONS.map(loc => (
          <FilterCheckbox key={loc} label={loc} checked={filters.location === loc}
            onChange={() => setFilters(f => ({ ...f, location: f.location === loc ? "" : loc }))} />
        ))}
        <div style={{ marginTop: 8, position: "relative" }}>
          <MapPin size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
          <input type="text" placeholder="Other location…"
            value={LOCATIONS.includes(filters.location) ? "" : filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            className="input input-sm" style={{ paddingLeft: 28, fontSize: "var(--text-xs)" }}
          />
        </div>
      </FilterSection>

      <FilterSection title="Work Mode">
        <FilterCheckbox label="Remote / Work from home" checked={filters.workFromHome}
          onChange={() => setFilters(f => ({ ...f, workFromHome: !f.workFromHome }))} />
      </FilterSection>
    </div>
  );

  return (
    <>
      <Head>
        <title>Browse Internships — InternArea</title>
        <meta name="description" content="Find internships from top companies. Filter by category, location, duration and stipend." />
      </Head>

      <Navbar />

      <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
        {/* Page Header */}
        <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--border-subtle)", padding: "28px 0" }}>
          <div className="page-container">
            <h1 className="heading-page" style={{ marginBottom: 4 }}>Browse Internships</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-neutral-500)" }}>
              {allInternships.length} internship opportunities from verified companies
            </p>

            {/* Search */}
            <div style={{ display: "flex", marginTop: 20, background: "var(--color-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", overflow: "hidden", maxWidth: 680 }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "11px 14px", gap: 8, borderRight: "1px solid var(--border-subtle)" }}>
                <Search size={15} color="var(--color-neutral-400)" />
                <input
                  type="text" placeholder="Search by title, skills or company"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", color: "var(--color-neutral-900)", background: "transparent", width: "100%" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "11px 14px", gap: 8, flex: "0 0 180px" }}>
                <MapPin size={15} color="var(--color-neutral-400)" />
                <input
                  type="text" placeholder="Location"
                  value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                  style={{ border: "none", outline: "none", fontSize: "var(--text-sm)", color: "var(--color-neutral-900)", background: "transparent", width: "100%" }}
                />
              </div>
              <button className="btn btn-primary" style={{ margin: 5, borderRadius: "var(--radius-sm)", padding: "0 20px", flexShrink: 0 }}>
                Search
              </button>
            </div>

            {/* Active chip filters */}
            {activeFilters.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500 }}>Active:</span>
                {activeFilters.map(chip => (
                  <span key={chip} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "var(--color-brand-100)", color: "var(--color-brand-900)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 500, border: "1px solid var(--color-brand-200)" }}>
                    {chip}
                    <button onClick={() => removeChip(chip)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--color-brand-700)", padding: 0, lineHeight: 1 }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <button onClick={clearFilters} style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Clear all</button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="page-container" style={{ padding: "32px var(--page-padding-desktop)" }}>
          <button className="md:hidden" onClick={() => setIsMobileFilterOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--color-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-neutral-700)", marginBottom: 20, cursor: "pointer" }}>
            <Filter size={16} /> Show Filters
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }} className="listing-grid">
            {/* Sidebar */}
            <aside style={{ background: "var(--color-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "20px 20px 24px", position: "sticky", top: 80 }} className="hidden md:block">
              <FilterPanel />
            </aside>

            {/* Results */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-neutral-700)" }}>
                  <strong style={{ color: "var(--color-neutral-900)" }}>{filtered.length}</strong> internships found
                </span>
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius-md)" }} />)}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 0", color: "var(--color-neutral-400)" }}>
                  <Briefcase size={40} style={{ margin: "0 auto 16px" }} />
                  <p style={{ fontSize: "var(--text-md)", fontWeight: 500, marginBottom: 8 }}>No internships found</p>
                  <p style={{ fontSize: "var(--text-sm)" }}>Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: 20 }}>Clear all filters</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cards.map(card => <JobCard key={card._id} {...card} variant="compact" />)}
                </div>
              )}

              {filtered.length > 0 && (
                <div style={{ marginTop: 28, textAlign: "center" }}>
                  <Link href="/job" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-brand-900)", textDecoration: "none", padding: "10px 20px", background: "var(--color-brand-100)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-brand-200)" }}>
                    Browse Jobs too <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-modal)" as any, background: "rgba(20,33,36,0.5)" }} onClick={() => setIsMobileFilterOpen(false)}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(320px, 100vw)", background: "var(--color-surface)", padding: "24px 20px", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: "var(--text-md)", color: "var(--color-neutral-900)" }}>Filters</span>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-neutral-500)" }}><X size={20} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .listing-grid { grid-template-columns: 1fr !important; }
          .hidden.md\\:block { display: none !important; }
        }
      `}</style>
    </>
  );
}