import React from "react";
import { LucideIcon } from "lucide-react";

interface ProfileSectionCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  id?: string;
}

export default function ProfileSectionCard({
  title,
  icon: Icon,
  iconColor = "text-[#FF3F3F]",
  accentColor = "#FF3F3F",
  children,
  action,
  className = "",
  noPadding = false,
  id,
}: ProfileSectionCardProps) {
  return (
    <div
      id={id}
      className={`relative rounded-xl border border-[#1e1e22] bg-[#0e0e11] transition-colors duration-200 ${className}`}
    >
      {/* left accent bar */}
      <div
        className="absolute top-4 left-0 w-0.75 h-8 rounded-r-full opacity-60 pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className={noPadding ? "" : "p-5 sm:p-6"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
              <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
            </div>
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>

        {children}
      </div>
    </div>
  );
}
