import { useState } from "react";
import type { User } from "../types";
import { getAvatarUrl } from "../utils";

interface LoginPageProps {
  onLogin?: (user: User, token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (isSignup) {
      if (!formData.name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = isSignup
        ? `${import.meta.env.VITE_API_BASE_URL}/api/user/signup`
        : `${import.meta.env.VITE_API_BASE_URL}/api/user/signin`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // if (isSignup) {
      //   setIsSignup(false);

      //   setFormData({
      //     name: "",
      //     email: formData.email,
      //     password: "",
      //     confirmPassword: "",
      //   });

      //   alert(
      //     "Account created successfully. Please verify your email before signing in.",
      //   );

      //   return;
      // }

      /**
       * EXPECTED BACKEND RESPONSE
       *
       * {
       *   success: true,
       *   user: {
       *     id: "...",
       *     name: "...",
       *     avatar: "...",
       *     role: "...",
       *     location: "..."
       *   }
       * }
       */

      const token: string = data.access_token ?? '';

      if (data.user) {
        onLogin?.(data.user, token);
      } else {
        /**
         * Temporary fallback until your profile table is ready.
         * Remove once backend returns a full User object.
         */
        const user: User = {
          id: data.session?.user?.id || crypto.randomUUID(),
          name: formData.name || "User",
          avatar: getAvatarUrl(formData.name || "User", ""),
          role: "Member",
          location: "",
        };

        onLogin?.(user, token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-gray-800 bg-[#111111]">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#111111] to-[#1a1a1a] border-r border-gray-800">
          <div>
            <h1 className="text-4xl font-bold text-white">HuntInTown</h1>

            <p className="mt-4 text-gray-400 text-lg">
              Connect with local businesses, skilled professionals, and
              opportunities around you.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-1">
                Post Requirements
              </h3>

              <p className="text-gray-400 text-sm">
                Share your requirements and receive offers from verified
                professionals.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">
                Connect Instantly
              </h3>

              <p className="text-gray-400 text-sm">
                Chat directly with service providers and businesses.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">
                Build Reputation
              </h3>

              <p className="text-gray-400 text-sm">
                Grow your network and showcase your expertise.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            © 2026 HuntInTown. All rights reserved.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">HuntInTown</h1>

              <p className="text-gray-400 mt-2">Connect. Collaborate. Grow.</p>
            </div>

            {/* Toggle */}
            <div className="flex bg-[#1a1a1a] rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup(false);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  !isSignup
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup(true);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isSignup
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>

              <p className="text-gray-400 mt-1 text-sm">
                {isSignup
                  ? "Join HuntInTown and start connecting."
                  : "Sign in to continue."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {isSignup ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors text-white font-medium py-3 rounded-xl cursor-pointer"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <button
              type="button"
              className="w-full border border-gray-800 bg-[#1a1a1a] hover:bg-[#222] transition-colors text-white py-3 rounded-xl font-medium cursor-pointer"
            >
              Continue with Google
            </button>

            <p className="text-center text-gray-400 text-sm mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup((prev) => !prev);
                }}
                className="ml-2 text-red-500 hover:text-red-400 cursor-pointer"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
