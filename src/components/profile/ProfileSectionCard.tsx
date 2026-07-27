import React from "react";
import { LucideIcon } from "lucide-react";

interface ProfileSectionCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
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
  children,
  action,
  className = "",
  noPadding = false,
  id,
}: ProfileSectionCardProps) {
  return (
    <section
      id={id}
      className={`
        rounded-2xl
        border border-[#232327]
        bg-[#1e1e1f]
        transition-colors
        hover:border-[#313136]
        ${className}
      `}
    >
      <div className={noPadding ? "" : "p-6"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />

            <h2 className="text-lg font-semibold tracking-tight text-white">
              {title}
            </h2>
          </div>

          {action}
        </div>

        {children}
      </div>
    </section>
  );
}