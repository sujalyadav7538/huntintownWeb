interface ProfileSkillsProps {
  skills: string[];
}

export default function ProfileSkills({
  skills,
}: ProfileSkillsProps) {
  if (!skills.length) return null;

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
        Skills
      </h4>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-md bg-[#1b1b1d] border border-[#232327] text-xs text-zinc-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}