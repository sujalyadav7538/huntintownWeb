import { Shield } from "lucide-react";
import { User } from "../../../types";

interface VerificationSectionProps {
  user: User;
}

export default function VerificationSection({
  user,
}: VerificationSectionProps) {
  return (
    <>
      <div className="hidden md:block">
        <VerificationSectionDesktop user={user} />
      </div>

      <div className="md:hidden">
        <VerificationSectionMobile user={user} />
      </div>
    </>
  );
}

interface VerificationSectionLayoutProps extends VerificationSectionProps {}

function VerificationSectionDesktop({ user }: VerificationSectionLayoutProps) {
  return <VerificationContent user={user} />;
}

function VerificationSectionMobile({ user }: VerificationSectionLayoutProps) {
  return <VerificationContent user={user} />;
}

function VerificationContent({ user }: VerificationSectionProps) {
  const isVerified =
    user.isEmailVerified === true || user.isGovernmentVerified === true;

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/6 p-4">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            {isVerified ? "Account verified" : "Verification not complete"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
            {isVerified
              ? "Your identity has been confirmed. Verified members receive 3× more responses."
              : "Submit your ID to unlock the verified badge and increase trust."}
          </p>
        </div>
      </div>
      <p className="text-xs text-zinc-600">
        Full verification management will be available in Settings → Identity.
      </p>
    </div>
  );
}
