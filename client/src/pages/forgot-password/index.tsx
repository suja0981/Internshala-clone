import axios from "axios";
import { KeyRound, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Please enter your email or phone number.");
      return;
    }

    setNewPassword("");
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        identifier,
      });
      
      toast.success(res.data.message);
      setNewPassword(res.data.newPassword);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        setErrorMsg(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <KeyRound className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your registered email or phone number to reset it.
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm" role="alert">
              {errorMsg}
            </div>
          )}

          {newPassword ? (
            <div className="text-center">
              <div className="mb-4 text-sm text-gray-600">
                Your new generated password is:
              </div>
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 font-mono text-2xl tracking-widest text-gray-900 mb-6">
                {newPassword}
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Please copy this password and keep it safe. It is made of uppercase and lowercase letters only.
              </p>
              <Link
                href="/adminlogin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email or Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g. user@example.com or 1234567890"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm">
            <Link href="/adminlogin" className="font-medium text-blue-600 hover:text-blue-500">
              Remember your password? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
