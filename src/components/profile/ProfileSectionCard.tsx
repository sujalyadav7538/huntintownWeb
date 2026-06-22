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
      className={`relative rounded-2xl bg-white/2.5 border border-white/6
        hover:border-white/10 transition-colors duration-300 ${className}`}
    >
      {/* top accent line — uses rounded-t-2xl to match card, no overflow-hidden needed */}
      <div
        className="absolute top-0 left-0 w-full h-px opacity-50 pointer-events-none rounded-t-2xl"
        style={{
          background: `linear-gradient(to right, transparent, ${accentColor}60, transparent)`,
        }}
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
