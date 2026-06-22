import { User } from '../../types';
import { Zap } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';

interface ProfileSkillsProps {
  user: User;
}

const SKILL_COLORS = [
  'text-violet-300 bg-violet-400/10 border-violet-400/20 hover:bg-violet-400/20',
  'text-sky-300 bg-sky-400/10 border-sky-400/20 hover:bg-sky-400/20',
  'text-emerald-300 bg-emerald-400/10 border-emerald-400/20 hover:bg-emerald-400/20',
  'text-amber-300 bg-amber-400/10 border-amber-400/20 hover:bg-amber-400/20',
  'text-rose-300 bg-rose-400/10 border-rose-400/20 hover:bg-rose-400/20',
  'text-cyan-300 bg-cyan-400/10 border-cyan-400/20 hover:bg-cyan-400/20',
];

export default function ProfileSkills({ user }: ProfileSkillsProps) {
  const skills = user.skills ?? [];
  const services = user.services ?? [];
  const all = [...skills, ...services];

  return (
    <ProfileSectionCard
      title="Expertise & Skills"
      icon={Zap}
      iconColor="text-violet-400"
      accentColor="#a78bfa"
    >
      {all.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {all.map((skill, i) => (
            <span
              key={skill}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium
                transition-all duration-200 cursor-default ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-zinc-600 text-sm italic">No skills added yet.</p>
      )}
    </ProfileSectionCard>
  );
}