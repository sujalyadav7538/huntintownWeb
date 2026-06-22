import { User } from '../../types';
import { Activity, CheckCircle, MessageSquare, Star, UserPlus, Zap } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';

interface ActivityItem {
  id: string;
  type: 'completed' | 'review' | 'joined' | 'response' | 'skill';
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  time: string;
}

function buildActivity(user: User): ActivityItem[] {
  const items: ActivityItem[] = [];

  if (user.joinedAt) {
    items.push({
      id: 'joined',
      type: 'joined',
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
      type: 'skill',
      title: 'Added expertise',
      sub: user.skills.slice(0, 2).join(', ') + (user.skills.length > 2 ? ` +${user.skills.length - 2} more` : ''),
      icon: Zap,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-400/10',
      time: '—',
    });
  }

  if ((user.completedRequests ?? 0) > 0) {
    items.push({
      id: 'completed',
      type: 'completed',
      title: `${user.completedRequests} requests completed`,
      sub: 'Consistently delivering quality work',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
      time: 'Recent',
    });
  }

  if ((user.rating ?? 0) >= 4.5) {
    items.push({
      id: 'rating',
      type: 'review',
      title: `Rated ${user.rating?.toFixed(1)} stars`,
      sub: `Highly rated by ${user.reviewCount ?? 'the'} community`,
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10',
      time: 'Ongoing',
    });
  }

  if ((user.reputation ?? 0) > 0) {
    items.push({
      id: 'response',
      type: 'response',
      title: 'Active responder',
      sub: `${user.reputation} reputation points earned`,
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
}

export default function ProfileActivity({ user }: ProfileActivityProps) {
  const items = buildActivity(user);

  if (items.length === 0) return null;

  return (
    <ProfileSectionCard
      title="Recent Activity"
      icon={Activity}
      iconColor="text-sky-400"
      accentColor="#38bdf8"
    >
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3.75 top-0 bottom-0 w-px bg-white/5" />
        <div className="flex flex-col gap-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className={`flex items-start gap-4 ${idx < items.length - 1 ? 'pb-5' : ''}`}>
                {/* Icon bubble on timeline */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold text-zinc-200 leading-snug">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.sub}</p>
                </div>
                <span className="text-[11px] text-zinc-600 shrink-0 pt-1">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </ProfileSectionCard>
  );
}
