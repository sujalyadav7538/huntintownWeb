interface ProfileCompletionProps {
  percentage: number;
}

export default function ProfileCompletion({
  percentage,
}: ProfileCompletionProps) {
  return (
    <div className="bg-[#121214] border border-[#232327] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider font-black text-zinc-300">
          Profile Completion
        </h3>

        <span className="text-[#FF3F3F] font-black text-sm">
          {percentage}%
        </span>
      </div>

      <div className="h-2 bg-[#1b1b1d] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FF3F3F] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

   
    </div>
  );
}