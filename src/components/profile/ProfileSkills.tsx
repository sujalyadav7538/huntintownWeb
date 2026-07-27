import { User } from "../../types";
import { Zap, BriefcaseBusiness, Wrench } from "lucide-react";
import ProfileSectionCard from "./ProfileSectionCard";

interface ProfileSkillsProps {
  user: User;
}

function SkillGroup({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-zinc-400" />
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="text-xs text-zinc-500">• {items.length}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="
              px-3 py-1.5
              rounded-full
              border border-[#2A2A2F]
              bg-[#171719]
              text-sm
              text-zinc-300
              hover:border-[#FF3F3F]/30
              hover:text-white
              transition-colors
            "
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProfileSkills({ user }: ProfileSkillsProps) {
  const skills = user.skills ?? [];
  const services = user.services ?? [];
  const total = skills.length + services.length;

  return (
    <ProfileSectionCard
      title="Skills & Services"
      icon={Zap}
      iconColor="text-[#FF3F3F]"
    >
      {total > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#232327] pb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {total} Skills Listed
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Skills and services available through your profile.
              </p>
            </div>
          </div>

          <SkillGroup
            title="Professional Skills"
            icon={BriefcaseBusiness}
            items={skills}
          />

          <SkillGroup title="Services" icon={Wrench} items={services} />
        </div>
      ) : (
        <div className="py-10 text-center">
          <Zap className="w-7 h-7 mx-auto text-zinc-700" />

          <p className="mt-3 text-white font-medium">No skills added yet</p>

          <p className="mt-1 text-sm text-zinc-500">
            Add your skills and services to showcase your expertise.
          </p>
        </div>
      )}
    </ProfileSectionCard>
  );
}
