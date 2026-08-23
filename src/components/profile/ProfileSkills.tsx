import { User } from "../../types";

interface ProfileSkillsProps {
  user: User;
}

export default function ProfileSkills({ user }: ProfileSkillsProps) {
  const all = [...(user.skills ?? []), ...(user.services ?? [])];

  return (
    <div className="theme-card rounded-xl border p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-muted text-xs font-bold uppercase tracking-wider">Skills</h3>
        {all.length > 0 && (
          <span className="theme-text-muted text-[10px]">{all.length} listed</span>
        )}
      </div>

      {all.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {all.map((skill) => (
            <span
              key={skill}
              className="theme-chip rounded-lg border px-3 py-1.5 text-[12px] transition hover:border-[#FF3F3F]/30"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="theme-text-muted text-[12px]">No skills added yet.</p>
      )}
    </div>
  );
}
