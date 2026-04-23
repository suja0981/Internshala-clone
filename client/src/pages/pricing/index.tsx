import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, AlertTriangle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import Head from 'next/head';

const plans = [
  { name: 'Free', price: 0, limits: '1 application/month', features: ['Basic support', 'Apply to 1 internship'] },
  { name: 'Bronze', price: 100, limits: '3 applications/month', features: ['Standard support', 'Apply to 3 internships'] },
  { name: 'Silver', price: 300, limits: '5 applications/month', features: ['Priority support', 'Apply to 5 internships'] },
  { name: 'Gold', price: 1000, limits: 'Unlimited applications', features: ['24/7 Dedicated support', 'Unlimited applications', 'Resume review'] },
];

export default function Pricing() {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [isTimeValid, setIsTimeValid] = useState(true);

  useEffect(() => {
    // Check if within 12:00 PM - 12:00 AM IST
    const checkTime = () => {
      const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: 'numeric' };
      const istHour = parseInt(new Date().toLocaleString('en-US', options as any), 10);
      setIsTimeValid(istHour >= 12 && istHour <= 23);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

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
        } catch (error) {
          console.error("Error fetching user details", error);
        }
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleSubscribe = async (planName: string, price: number) => {
    if (!user) {
      toast.error("Please log in to subscribe.");
      return;
    }
    if (!isTimeValid) {
      toast.error("Payments are only allowed between 12:00 PM and 12:00 AM IST.");
      return;
    }

    try {
      // 1. Create order
      const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`, {
        plan: planName,
        uid: user.uid
      });

      const { order } = orderRes.data;

      // 2. Initialize Razorpay
      const options = {
        key: 'rzp_test_1234567890abcd', // Dummy test key for assignment
        amount: order.amount,
        currency: order.currency,
        name: 'Intern Area',
        description: `${planName} Plan Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'mock_signature',
              plan: planName,
              uid: user.uid
            });
            
            toast.success(verifyRes.data.message);
            // Update local user state to reflect new plan immediately
            setDbUser((prev: any) => ({ ...prev, plan: planName, applicationsThisMonth: 0 }));
          } catch (error: any) {
            toast.error(error.response?.data?.error || "Verification failed");
          }
        },
        prefill: {
          name: user.displayName || 'User',
          email: user.email || 'user@example.com'
        },
        theme: {
          color: '#2563EB'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error initiating payment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </Head>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Subscription Plans</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Supercharge your career journey. Choose the plan that fits your ambition.
        </p>

        {!isTimeValid && (
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-lg text-sm font-medium">
            <AlertTriangle size={18} />
            Important: Payment transactions are strictly available only between 12:00 PM and 12:00 AM IST.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl shadow-lg border-2 flex flex-col ${dbUser?.plan === plan.name ? 'border-blue-500 relative' : 'border-transparent'}`}>
            {dbUser?.plan === plan.name && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Current Plan
              </div>
            )}
            
            <div className="p-8 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-sm font-medium text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block mb-6">
                {plan.limits}
              </p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 pt-0 mt-auto">
              {plan.price === 0 ? (
                <button disabled className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-xl font-bold cursor-not-allowed">
                  Default Plan
                </button>
              ) : (
                <button 
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  disabled={!isTimeValid || dbUser?.plan === plan.name}
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
                    dbUser?.plan === plan.name 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : !isTimeValid 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {dbUser?.plan === plan.name ? 'Active' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
