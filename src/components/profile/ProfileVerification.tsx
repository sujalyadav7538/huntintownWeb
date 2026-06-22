import { User } from '../../types';
import { Shield, Mail, Phone, MapPin, IdCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';

interface VerificationItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'verified' | 'pending' | 'unverified';
}

function VerificationItem({ label, icon: Icon, status }: VerificationItemProps) {
  const config = {
    verified: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      label: 'Verified',
    },
    pending: {
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      label: 'Pending',
    },
    unverified: {
      icon: XCircle,
      color: 'text-zinc-600',
      bg: 'bg-white/3',
      border: 'border-white/6',
      label: 'Not added',
    },
  }[status];

  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/7 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <span className="text-sm text-zinc-300 font-medium">{label}</span>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.color}`}
      >
        <StatusIcon className="w-3 h-3" />
        {config.label}
      </span>
    </div>
  );
}

interface ProfileVerificationProps {
  user: User;
}

export default function ProfileVerification({ user }: ProfileVerificationProps) {
  const isVerified = user.isVerified !== false;

  return (
    <ProfileSectionCard
      title="Verification Status"
      icon={Shield}
      iconColor="text-emerald-400"
      accentColor="#34d399"
      action={
        isVerified ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            ID Verified
          </span>
        ) : null
      }
    >
      <div className="divide-y divide-white/4">
        <VerificationItem label="Email address" icon={Mail} status="verified" />
        <VerificationItem label="Phone number" icon={Phone} status={isVerified ? 'verified' : 'pending'} />
        <VerificationItem label="Government ID" icon={IdCard} status={isVerified ? 'verified' : 'unverified'} />
        <VerificationItem label="Location" icon={MapPin} status={user.location ? 'verified' : 'unverified'} />
      </div>
    </ProfileSectionCard>
  );
}
