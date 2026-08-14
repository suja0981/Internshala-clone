import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, Zap, Star, Crown, Shield, CheckCircle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import Head from 'next/head';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

const planRank: Record<string, number> = { Free: 0, Bronze: 1, Silver: 2, Gold: 3 };

const plans = [
  {
    name: 'Free',
    price: 0,
    limits: '1 application/month',
    icon: Shield,
    tag: null,
    accent: 'var(--color-neutral-500)',
    accentLight: 'var(--color-neutral-100)',
    features: ['1 internship application/month', 'Basic platform access', 'Community support'],
  },
  {
    name: 'Bronze',
    price: 100,
    limits: '3 applications/month',
    icon: Star,
    tag: null,
    accent: '#b87333',
    accentLight: '#fdf4ec',
    features: ['3 internship applications/month', 'Standard support', 'Application tracking'],
  },
  {
    name: 'Silver',
    price: 300,
    limits: '5 applications/month',
    icon: Zap,
    tag: 'Most Popular',
    accent: 'var(--color-brand-900)',
    accentLight: 'var(--color-brand-50)',
    features: ['5 internship applications/month', 'Priority support', 'Application tracking', 'Early job alerts'],
    popular: true,
  },
  {
    name: 'Gold',
    price: 1000,
    limits: 'Unlimited applications',
    icon: Crown,
    tag: 'Best Value',
    accent: '#9f7c2c',
    accentLight: '#fefce8',
    features: ['Unlimited applications/month', '24/7 Dedicated support', 'Application tracking', 'Resume review', 'Early job alerts'],
  },
];

export default function PricingPage() {
  const [user, setUser]         = useState<any>(null);
  const [dbUser, setDbUser]     = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDbLoading(true);
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          });
          setDbUser(res.data);
        } catch (err) {
          console.error('Error syncing user', err);
        } finally {
          setDbLoading(false);
        }
      } else {
        setDbUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubscribe = useCallback(async (planName: string) => {
    if (!user) { toast.error('Please log in to subscribe.'); return; }
    if (dbLoading || !dbUser) { toast.error('Please wait while your account loads.'); return; }
    if (planRank[planName] <= planRank[dbUser.plan ?? 'Free']) {
      toast.error(`You are already on the ${dbUser.plan} plan.`);
      return;
    }
    try {
      const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`, {
        plan: planName, uid: user.uid,
      });
      const { order } = orderRes.data;
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
      const options = {
        key: rzpKey,
        amount: order.amount,
        currency: order.currency,
        name: 'InternArea',
        description: `${planName} Plan — ₹${order.amount / 100}/month`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'mock_signature',
              plan: planName, uid: user.uid,
            });
            toast.success(verifyRes.data.message);
            setLastInvoice({ ref: verifyRes.data.invoiceRef, plan: verifyRes.data.plan, transactionId: verifyRes.data.transactionId });
            setDbUser((prev: any) => ({ ...prev, plan: planName, applicationsThisMonth: 0 }));
          } catch (err: any) {
            toast.error(err.response?.data?.error || 'Payment verification failed.');
          }
        },
        prefill: { name: user.displayName || 'User', email: user.email || '' },
        theme: { color: '#1F5F66' },
        modal: { ondismiss: () => toast.info('Payment cancelled.') },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error initiating payment.');
    }
  }, [user, dbUser, dbLoading]);

  const currentPlanRank = planRank[dbUser?.plan ?? 'Free'];

  return (
    <>
      <Head>
        <title>Pricing — InternArea</title>
        <meta name="description" content="Choose a subscription plan that fits your career ambitions. Free, Bronze, Silver, and Gold plans available." />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </Head>

      <Navbar />

      <main style={{ background: "var(--color-background)", minHeight: "100vh", paddingBottom: 80 }}>

        {/* Page Header */}
        <div style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--border-subtle)", padding: "56px 0 48px" }}>
          <div className="page-container" style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", background: "var(--color-brand-100)", borderRadius: "var(--radius-full)", marginBottom: 18, border: "1px solid var(--color-brand-200)" }}>
              <Zap size={13} color="var(--color-brand-900)" />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand-900)" }}>Supercharge your career</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-neutral-900)", letterSpacing: "-0.025em", marginBottom: 12 }}>
              Simple, transparent pricing
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--color-neutral-500)", maxWidth: 480, margin: "0 auto" }}>
              Choose the plan that fits your ambition. Upgrade or cancel anytime.
            </p>
            {dbUser && (
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--color-brand-50)", border: "1px solid var(--color-brand-200)", borderRadius: "var(--radius-full)", fontSize: "var(--text-sm)", color: "var(--color-brand-900)", fontWeight: 600 }}>
                <CheckCircle size={14} /> Current plan: <strong>{dbUser.plan || 'Free'}</strong> — {dbUser.applicationsThisMonth || 0} applications used this month
              </div>
            )}
          </div>
        </div>

        {/* Invoice receipt */}
        {lastInvoice && (
          <div className="page-container" style={{ paddingTop: 24 }}>
            <div style={{ background: "var(--color-success-50)", border: "1px solid var(--color-success-200)", borderRadius: "var(--radius-lg)", padding: "20px 24px", maxWidth: 560, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <CheckCircle size={18} color="var(--color-success-600)" />
                <span style={{ fontWeight: 700, color: "var(--color-success-800)", fontSize: "var(--text-md)" }}>Payment Successful — Invoice</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-sm)", color: "var(--color-success-700)" }}>
                <div><strong>Invoice Ref:</strong> {lastInvoice.ref}</div>
                <div><strong>Transaction ID:</strong> {lastInvoice.transactionId}</div>
                <div><strong>Plan Activated:</strong> {lastInvoice.plan}</div>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-success-600)", marginTop: 8 }}>A detailed invoice has been sent to your registered email.</p>
            </div>
          </div>
        )}

        {/* Plan Cards */}
        <div className="page-container" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="plans-grid">
            {plans.map((plan) => {
              const isCurrentPlan = (dbUser?.plan ?? 'Free') === plan.name;
              const isDowngrade   = planRank[plan.name] < currentPlanRank;
              const PlanIcon      = plan.icon;

              return (
                <div
                  key={plan.name}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-xl)",
                    border: `2px solid ${isCurrentPlan ? plan.accent : plan.popular ? plan.accent + "40" : "var(--border-default)"}`,
                    boxShadow: plan.popular ? "var(--shadow-lg)" : "var(--shadow-xs)",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    transform: plan.popular ? "translateY(-8px)" : "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = plan.popular ? "translateY(-12px)" : "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = plan.popular ? "translateY(-8px)" : "none"; (e.currentTarget as HTMLElement).style.boxShadow = plan.popular ? "var(--shadow-lg)" : "var(--shadow-xs)"; }}
                >
                  {/* Tag badge */}
                  {(plan.tag || isCurrentPlan) && (
                    <div style={{
                      position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                      background: isCurrentPlan ? "var(--color-success-600)" : plan.accent,
                      color: "#fff", padding: "3px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "var(--text-xs)", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}>
                      {isCurrentPlan ? "Your Plan" : plan.tag}
                    </div>
                  )}

                  {/* Plan header */}
                  <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: plan.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PlanIcon size={22} style={{ color: plan.accent }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-neutral-900)" }}>{plan.name}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)" }}>{plan.limits}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ padding: "16px 24px 0" }}>
                    {plan.price === 0 ? (
                      <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1 }}>Free</div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500 }}>₹</span>
                        <span style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-neutral-900)", lineHeight: 1 }}>{plan.price}</span>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", fontWeight: 500 }}>/month</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul style={{ padding: "16px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10, margin: 0, listStyle: "none" }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--text-sm)", color: "var(--color-neutral-700)" }}>
                        <Check size={14} style={{ color: plan.accent, marginTop: 2, flexShrink: 0 }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div style={{ padding: "12px 24px 24px" }}>
                    {plan.price === 0 ? (
                      <button disabled className="btn btn-outline" style={{ width: "100%", opacity: 0.5, cursor: "not-allowed" }}>
                        Default Plan
                      </button>
                    ) : isCurrentPlan ? (
                      <button disabled className="btn" style={{ width: "100%", background: "var(--color-success-50)", color: "var(--color-success-700)", border: "1px solid var(--color-success-200)", cursor: "not-allowed", fontWeight: 600 }}>
                        ✓ Active Plan
                      </button>
                    ) : isDowngrade ? (
                      <button disabled title="You cannot downgrade your plan" className="btn btn-outline" style={{ width: "100%", opacity: 0.4, cursor: "not-allowed" }}>
                        Not Available
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.name)}
                        disabled={dbLoading}
                        className="btn btn-primary"
                        style={{ width: "100%", background: plan.popular ? plan.accent : undefined, opacity: dbLoading ? 0.5 : 1 }}
                      >
                        {dbLoading ? 'Loading…' : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-neutral-400)", marginTop: 32 }}>
            Subscription limits reset on the 1st of every month. Payments processed securely via Razorpay.
          </p>
        </div>

        {/* FAQ / Guarantee Section */}
        <div className="page-container" style={{ paddingTop: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="guarantee-grid">
            {[
              { icon: <Shield size={20} />, title: "Secure payments", desc: "All transactions handled by Razorpay, India's most trusted payment gateway." },
              { icon: <CheckCircle size={20} />, title: "Cancel anytime", desc: "No lock-in. Your plan is monthly and you can stop at any time." },
              { icon: <Zap size={20} />, title: "Instant activation", desc: "Your plan upgrades instantly upon successful payment." },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: "20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--color-brand-100)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-brand-900)", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-neutral-500)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .guarantee-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
