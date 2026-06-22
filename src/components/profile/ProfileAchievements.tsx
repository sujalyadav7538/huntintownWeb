import { User } from '../../types';
import { Award, Zap, CheckCircle2, Users, Star, Shield, Trophy } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  earned: (user: User) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Joined during launch phase',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    earned: () => true,
  },
  {
    id: 'verified',
    title: 'Verified Member',
    description: 'Identity confirmed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    earned: (u) => u.isVerified !== false,
  },
  {
    id: 'contributor',
    title: 'Community Helper',
    description: 'Actively helping others',
    icon: Users,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    earned: (u) => (u.completedRequests ?? 0) > 0 || (u.reputation ?? 0) > 100,
  },
  {
    id: 'top_rated',
    title: 'Top Rated',
    description: 'Rating above 4.5',
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    earned: (u) => (u.rating ?? 0) >= 4.5,
  },
  {
    id: 'trusted',
    title: 'Trusted Pro',
    description: '300+ reputation points',
    icon: Shield,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/20',
    earned: (u) => (u.reputation ?? 0) >= 300,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: '10+ completed requests',
    icon: Trophy,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    earned: (u) => (u.completedRequests ?? 0) >= 10,
  },
];

interface ProfileAchievementsProps {
  user: User;
}

export default function ProfileAchievements({ user }: ProfileAchievementsProps) {
  const earned = ACHIEVEMENTS.filter((a) => a.earned(user));
  const locked = ACHIEVEMENTS.filter((a) => !a.earned(user));

  return (
    <ProfileSectionCard
      title="Achievements"
      icon={Award}
      iconColor="text-amber-400"
      accentColor="#f59e0b"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {earned.map((a) => (
          <div
            key={a.id}
            className={`flex flex-col gap-3 p-4 rounded-xl border ${a.border} ${a.bg} hover:brightness-110 transition-all`}
          >
            <div
              className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}
            >
              <a.icon className={`w-4.5 h-4.5 ${a.color}`} />
            </div>
            <div>
              <p className={`text-xs font-bold ${a.color}`}>{a.title}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{a.description}</p>
            </div>
          </div>
        ))}
        {locked.slice(0, Math.max(0, 3 - earned.length)).map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 p-4 rounded-xl border border-white/4 bg-white/2 opacity-40 grayscale"
          >
            <div className="w-9 h-9 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center">
              <a.icon className="w-4.5 h-4.5 text-zinc-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-600">{a.title}</p>
              <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
