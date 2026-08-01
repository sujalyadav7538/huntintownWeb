interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 select-none py-1">
      <span className="flex-1 h-px bg-[#1e1e22]" />
      <span className="inline-flex items-center rounded-full border border-[#1e1e22] bg-[#0d0d10] px-3 py-1 text-[10px] text-zinc-500 tracking-wide shrink-0">
        {label}
      </span>
      <span className="flex-1 h-px bg-[#1e1e22]" />
    </div>
  );
}
