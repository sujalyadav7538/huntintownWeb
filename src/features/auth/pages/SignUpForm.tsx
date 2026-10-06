import type { SignupFormData } from "../types";

interface SignUpFormProps {
  formData: SignupFormData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  error: string;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

export default function SignUpForm({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  termsAccepted,
  onTermsAcceptedChange,
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-3.5">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-zinc-500">
            Full name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={onChange}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/50 focus:bg-white/[0.04]"
          />
        </div>

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
              onChange={onChange}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/50 focus:bg-white/[0.04]"
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
              onChange={onChange}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/50 focus:bg-white/[0.04]"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="signup-terms"
          className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-zinc-400"
        >
          <input
            id="signup-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => onTermsAcceptedChange(event.target.checked)}
            aria-describedby="signup-terms-error"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF3F3F]"
          />
          <span>I agree to the Terms &amp; Conditions and Privacy Policy.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !termsAccepted}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FF3F3F] py-3 text-sm font-semibold text-white transition hover:bg-[#e53535] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Please wait..." : "Create Account"}
      </button>
    </form>
  );
}
