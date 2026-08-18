import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import type { User } from "../types";
import { getAvatarUrl } from "../utils";
import { apiFetch } from "../lib/api";

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);
      try {
        const res = await apiFetch("/api/user/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google sign-in failed");
        onLogin?.(data.user, data.access_token ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

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

      const endpoint = isSignup ? `/api/user/signup` : `/api/user/signin`;

      const response = await apiFetch(endpoint, {
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

      const token: string = data.access_token ?? "";

      if (data.user) {
        onLogin?.(data.user, token);
      } else {
        const user: User = {
          id: data.session?.user?.id || crypto.randomUUID(),
          name: formData.name || "User",
          avatar: getAvatarUrl(formData.name || "User", ""),
          role: "Member",
          address: "",
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
    <main className="min-h-dvh  text-white">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl lg:grid-cols-[minmax(0,1fr)_520px]">
        {/* =====================================================
         * LEFT — Desktop Brand / Context
         * ===================================================== */}
        <section className="relative hidden overflow-hidden border-r border-white/6 lg:flex lg:min-h-dvh lg:flex-col lg:justify-between">
          {/* Background glow */}
          <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#FF3F3F]/[0.06] blur-3xl" />

          <div className="relative p-12 xl:p-16">
            {/* Brand */}
            <div className="flex items-center">
              <img src="/name.png" alt="HuntInTown" className="h-9 w-auto" />
            </div>

            {/* Main message */}
            <div className="mt-28 max-w-lg xl:mt-36">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3F3F]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Your local community
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Find help.
                <br />
                <span className="text-zinc-500">Offer help.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-500">
                Connect with people around you, share what you need, and
                discover how you can help others.
              </p>
            </div>

            {/* Features */}
            <div className="mt-14 flex items-center gap-7 xl:gap-8">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Local</p>

                <p className="mt-1 text-xs text-zinc-600">People around you</p>
              </div>

              <div className="h-8 w-px bg-white/[0.08]" />

              <div>
                <p className="text-sm font-semibold text-zinc-200">Direct</p>

                <p className="mt-1 text-xs text-zinc-600">Chat with people</p>
              </div>

              <div className="h-8 w-px bg-white/[0.08]" />

              <div>
                <p className="text-sm font-semibold text-zinc-200">Community</p>

                <p className="mt-1 text-xs text-zinc-600">
                  Build your reputation
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-12 pb-8 xl:px-16">
            <p className="text-[11px] text-zinc-700">© 2026 HuntInTown</p>
          </div>
        </section>

        {/* =====================================================
         * RIGHT — Authentication
         * ===================================================== */}
        <section className="flex min-h-dvh w-full items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
          <div className="w-full max-w-[390px]">
          

            {/* =================================================
             * Heading
             * ================================================= */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {isSignup
                  ? "Join your local community."
                  : "Sign in to continue to HuntInTown."}
              </p>
            </div>

            {/* =================================================
             * Auth Toggle
             * ================================================= */}
            <div className="mb-7 flex border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup(false);
                }}
                className={`relative flex-1 pb-3 text-sm font-semibold transition ${
                  !isSignup ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                Sign In
                {!isSignup && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-[#FF3F3F]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup(true);
                }}
                className={`relative flex-1 pb-3 text-sm font-semibold transition ${
                  isSignup ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                Sign Up
                {isSignup && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-[#FF3F3F]" />
                )}
              </button>
            </div>

            {/* =================================================
             * Form
             * ================================================= */}
            <form onSubmit={handleSubmit}>
              {isSignup ? (
                <div className="space-y-3.5">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                      Full name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.025]
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-[#FF3F3F]/50
                      focus:bg-white/[0.04]
                    "
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.025]
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-[#FF3F3F]/50
                      focus:bg-white/[0.04]
                    "
                    />
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="
                        w-full rounded-xl
                        border border-white/[0.08]
                        bg-white/[0.025]
                        px-4 py-3
                        text-sm text-white
                        outline-none
                        transition
                        placeholder:text-zinc-700
                        focus:border-[#FF3F3F]/50
                        focus:bg-white/[0.04]
                      "
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                        Confirm password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="
                        w-full rounded-xl
                        border border-white/[0.08]
                        bg-white/[0.025]
                        px-4 py-3
                        text-sm text-white
                        outline-none
                        transition
                        placeholder:text-zinc-700
                        focus:border-[#FF3F3F]/50
                        focus:bg-white/[0.04]
                      "
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.025]
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-[#FF3F3F]/50
                      focus:bg-white/[0.04]
                    "
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-[11px] font-medium text-zinc-500">
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-[11px] font-medium text-zinc-600 transition hover:text-[#FF3F3F]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <input
                      type="password"
                      name="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="
                      w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.025]
                      px-4 py-3
                      text-sm text-white
                      outline-none
                      transition
                      placeholder:text-zinc-700
                      focus:border-[#FF3F3F]/50
                      focus:bg-white/[0.04]
                    "
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                mt-6 flex w-full
                items-center justify-center
                rounded-xl
                bg-[#FF3F3F]
                py-3
                text-sm font-semibold text-white
                transition
                hover:bg-[#e53535]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            {/* =================================================
             * Divider
             * ================================================= */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                Or
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* =================================================
             * Google
             * ================================================= */}
            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={loading}
              className="
              flex w-full
              items-center justify-center
              gap-3
              rounded-xl
              border border-white/[0.08]
              bg-white/[0.025]
              py-3
              text-sm font-medium
              text-zinc-300
              transition
              hover:bg-white/[0.05]
              hover:text-white
              disabled:opacity-50
            "
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />

                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />

                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />

                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>

            {/* =================================================
             * Switch Account Type
             * ================================================= */}
            <p className="mt-7 text-center text-xs text-zinc-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsSignup((prev) => !prev);
                }}
                className="ml-1.5 font-semibold text-zinc-300 transition hover:text-[#FF3F3F]"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
