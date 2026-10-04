interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-2 select-none">
      <span className="rounded-md border border-[#25252a] bg-[#151518] px-2.5 py-1 text-[9px] font-medium tracking-wide text-zinc-500 shadow-sm">
        {label}
      </span>
    </div>
  );
}