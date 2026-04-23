import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, Search, Globe, X } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import Head from "next/head";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "zh-CN", name: "Chinese" },
  { code: "fr", name: "French" },
];

const Navbar = () => {
  const user = useSelector(selectuser);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  
  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);

  // Chrome Login Security State
  const [isChromeOtpModalOpen, setIsChromeOtpModalOpen] = useState(false);
  const [chromeOtp, setChromeOtp] = useState("");
  const [loginRecordId, setLoginRecordId] = useState("");
  const [pendingUserUid, setPendingUserUid] = useState("");

  useEffect(() => {
    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,es,hi,pt,zh-CN,fr', autoDisplay: false },
        'google_translate_element'
      );
    };
  }, []);

  const triggerTranslation = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
    setCurrentLang(langCode);
    setIsLangOpen(false);
  };

  const handleLanguageSelect = async (langCode: string) => {
    if (langCode === "fr") {
      if (!user) {
        toast.error("You must be logged in to switch to French.");
        setIsLangOpen(false);
        return;
      }
      setIsLangOpen(false);
      setIsOtpModalOpen(true);
      // Send OTP
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/language/send-otp`, { uid: user.uid });
        toast.success("OTP sent to your email to unlock French.");
      } catch (error) {
        toast.error("Failed to send OTP");
        setIsOtpModalOpen(false);
      }
    } else {
      triggerTranslation(langCode);
    }
  };

  const handleVerifyFrenchOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoadingOtp(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/language/verify-otp`, { uid: user.uid, otp });
      toast.success("French language unlocked!");
      setIsOtpModalOpen(false);
      triggerTranslation("fr");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setIsLoadingOtp(false);
      setOtp("");
    }
  };

  const handlelogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      
      const ua = navigator.userAgent;
      const browser = /Chrome/i.test(ua) && !/Edge|Edg/i.test(ua) ? 'Chrome' : 
                      /Firefox/i.test(ua) ? 'Firefox' : 
                      /Safari/i.test(ua) && !/Chrome/i.test(ua) ? 'Safari' : 'Other';
      const os = /Windows/i.test(ua) ? 'Windows' : 
                 /Mac/i.test(ua) ? 'MacOS' : 
                 /Linux/i.test(ua) ? 'Linux' : 
                 /Android/i.test(ua) ? 'Android' : 
                 /iOS|iPhone|iPad/i.test(ua) ? 'iOS' : 'Other';
      const deviceType = /Mobile|Android|iP(hone|od|ad)/i.test(ua) ? 'Mobile' : 'Desktop';
      
      let ipAddress = 'Unknown';
      try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        ipAddress = ipRes.data.ip;
      } catch (e) {}

      const trackRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/track-login`, {
        uid: currentUser.uid,
        email: currentUser.email,
        browser,
        os,
        deviceType,
        ipAddress
      });

      if (trackRes.status === 202) {
        setLoginRecordId(trackRes.data.recordId);
        setPendingUserUid(currentUser.uid);
        setIsChromeOtpModalOpen(true);
      } else {
        toast.success("logged in successfully");
      }
    } catch (error) {
      toast.error("login failed");
    }
  };

  const handleVerifyChromeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login-otp`, {
         uid: pendingUserUid,
         otp: chromeOtp,
         recordId: loginRecordId
       });
       toast.success("Login Verified!");
       setIsChromeOtpModalOpen(false);
    } catch (err: any) {
       toast.error(err.response?.data?.error || "Invalid OTP");
    }
  };

  const handlelogout = () => {
    signOut(auth);
  };

  return (
    <>
      <Head>
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async></script>
        <style>{`
          .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
          body { top: 0px !important; }
          #google_translate_element { display: none !important; }
        `}</style>
      </Head>
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element"></div>

      <div className="relative z-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="text-xl font-bold text-blue-600">
                  <img src={"/logo.png"} alt="Logo" className="h-16" />
                </a>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href={"/internship"} className="text-gray-700 hover:text-blue-600 font-medium">Internships</Link>
                <Link href={"/job"} className="text-gray-700 hover:text-blue-600 font-medium">Jobs</Link>
                <Link href={"/public-space"} className="text-gray-700 hover:text-blue-600 font-medium">Public Space</Link>
                <Link href={"/pricing"} className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
                <Link href={"/resume"} className="text-gray-700 hover:text-blue-600 font-medium">Resume Builder</Link>
                
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <Search size={16} className="text-gray-400" />
                  <input type="text" placeholder="Search..." className="ml-2 bg-transparent focus:outline-none text-sm w-32 lg:w-48" />
                </div>

                {/* Custom Language Dropdown */}
                <div className="relative">
                  <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                    <Globe size={18} />
                    <span className="uppercase text-sm font-bold">{currentLang}</span>
                    <ChevronDown size={14} />
                  </button>
                  {isLangOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg py-1 z-50">
                      {languages.map((lang) => (
                        <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="relative flex items-center space-x-4">
                    <Link href={"/profile"}>
                      <img src={user.photo || "/logo.png"} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                    </Link>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition" onClick={handlelogout}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={handlelogin} className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-50">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
                      <span className="text-gray-700 text-sm font-medium">Login</span>
                    </button>
                    <a href="/adminlogin" className="text-gray-600 hover:text-gray-800 text-sm font-medium">Admin</a>
                  </>
                )}
              </div>

            </div>
          </div>
        </nav>
      </div>

      {/* French OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative">
            <button onClick={() => setIsOtpModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Language Change</h3>
            <p className="text-sm text-gray-600 mb-4">To apply French, please enter the 6-digit OTP sent to your email.</p>
            <form onSubmit={handleVerifyFrenchOTP}>
              <input 
                type="text" 
                maxLength={6} 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP" 
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-center text-xl tracking-widest font-mono mb-4 focus:border-blue-500 outline-none"
              />
              <button type="submit" disabled={isLoadingOtp} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70">
                {isLoadingOtp ? 'Verifying...' : 'Verify & Translate'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chrome Security OTP Modal (Uncloseable) */}
      {isChromeOtpModalOpen && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border text-center relative">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Security Verification</h2>
            <p className="text-gray-600 mb-8">We detected a login from Google Chrome. For your security, please enter the OTP sent to your registered email to gain access to the platform.</p>
            <form onSubmit={handleVerifyChromeOtp}>
              <input 
                type="text" 
                maxLength={6} 
                required
                value={chromeOtp}
                onChange={(e) => setChromeOtp(e.target.value)}
                placeholder="Enter 6-digit OTP" 
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-center text-2xl tracking-widest font-mono mb-6 focus:border-blue-600 outline-none"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                Verify & Continue
              </button>
            </form>
            <button onClick={() => { signOut(auth); setIsChromeOtpModalOpen(false); }} className="mt-6 text-sm text-red-500 hover:text-red-700 font-medium">
              Cancel Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;