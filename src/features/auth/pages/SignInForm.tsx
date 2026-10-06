import type { SignupFormData } from "../types";

interface SignInFormProps {
  formData: SignupFormData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function SignInForm({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3.5">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onChange}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/50 focus:bg-white/[0.04]"
          />
        </div>

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
            onChange={onChange}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/50 focus:bg-white/[0.04]"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FF3F3F] py-3 text-sm font-semibold text-white transition hover:bg-[#e53535] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Please wait..." : "Sign In"}
      </button>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-500">
        By signing in, you acknowledge the Terms &amp; Conditions and Privacy
        Policy.
      </p>
    </form>
  );
}