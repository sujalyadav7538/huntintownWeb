import { Activity, CheckCircle, MessageSquare, Star, UserPlus, Zap } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';
import { User, UserMetric } from '../../types';

interface ActivityItem {
  id: string;
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  time: string;
}

function buildActivity(user: User, metric: UserMetric | null): ActivityItem[] {
  const items: ActivityItem[] = [];

  if (user.joinedAt) {
    items.push({
      id: 'joined',
      title: 'Joined HuntInTown',
      sub: `Profile created · ${user.joinedAt}`,
      icon: UserPlus,
      iconColor: 'text-[#FF3F3F]',
      iconBg: 'bg-[#FF3F3F]/10',
      time: user.joinedAt,
    });
  }

  if (user.skills && user.skills.length > 0) {
    items.push({
      id: 'skills',
      title: 'Added expertise',
      sub: user.skills.slice(0, 2).join(', ') + (user.skills.length > 2 ? ` +${user.skills.length - 2} more` : ''),
      icon: Zap,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-400/10',
      time: '—',
    });
  }

  const completed = metric?.helperMetrics.completedResponses ?? 0;
  if (completed > 0) {
    items.push({
      id: 'completed',
      title: `${completed} response${completed !== 1 ? 's' : ''} completed`,
      sub: 'Consistently delivering quality help',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
      time: 'Recent',
    });
  }

  const avgRating = metric?.reviewMetrics.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics.totalReviews ?? 0;
  if (avgRating >= 4.5 && totalReviews > 0) {
    items.push({
      id: 'rating',
      title: `Rated ${avgRating.toFixed(1)} stars`,
      sub: `Top-rated by ${totalReviews} community member${totalReviews !== 1 ? 's' : ''}`,
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10',
      time: 'Ongoing',
    });
  }

  const trustScore = metric?.trustScore ?? 0;
  if (trustScore > 0) {
    items.push({
      id: 'trust',
      title: 'Trust score earned',
      sub: `${trustScore.toFixed(0)} / 100 trust score`,
      icon: MessageSquare,
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-400/10',
      time: 'Ongoing',
    });
  }

  return items.slice(0, 5);
}

interface ProfileActivityProps {
  user: User;
  metric?: UserMetric | null;
}

export default function ProfileActivity({ user, metric }: ProfileActivityProps) {
  const items = buildActivity(user, metric ?? null);
  if (items.length === 0) return null;

  return (
    <ProfileSectionCard title="Recent Activity" icon={Activity} iconColor="text-sky-400" accentColor="#38bdf8">
      <div className="relative">
        <div className="absolute left-3.75 top-0 bottom-0 w-px bg-white/5" />
        <div className="flex flex-col gap-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`flex items-start gap-4 ${idx < items.length - 1 ? 'pb-5' : ''}`}>
                <div className={`relative z-10 w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold text-zinc-200 leading-snug">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[10px] text-zinc-700 shrink-0 pt-1.5 font-mono">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </ProfileSectionCard>
  );
}
