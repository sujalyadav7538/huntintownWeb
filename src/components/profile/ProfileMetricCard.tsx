import { LucideIcon } from "lucide-react";

interface ProfileMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;

  color?: string;
  progress?: number;
  trend?: string;

  size?: "sm" | "md" | "lg";

  className?: string;
  showProgress?: boolean;
  showIcon?: boolean;
  iconBackground?: boolean;
  align?: "left" | "center";
  badge?: {
    label: string;
    color?: string;
    bg?: string;
    border?: string;
    icon?: LucideIcon;
  };
}

export default function ProfileMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "#FF3F3F",
  progress,
  trend,
  size = "md",

  className = "",
  showProgress = true,
  showIcon = true,
  iconBackground = true,
  align = "left",
  badge,
}: ProfileMetricCardProps) {
  const valueSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-5 h-5",
  }[size];

  return (
    <div
      className={`rounded-2xl border border-[#232327]  bg-[#1e1e1f] p-4 ${className}`}
    >
      <div
        className={`flex ${
          align === "center"
            ? "flex-col items-center text-center gap-4"
            : "items-start justify-between"
        }`}
      >
        <div className={align === "center" ? "" : "flex-1"}>
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 font-bold">
            {title}
          </p>

          <h3 className={`${valueSize} font-black mt-2 text-white`}>{value}</h3>

          {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}

          {trend && (
            <p className="mt-2 text-xs font-semibold" style={{ color }}>
              {trend}
            </p>
          )}
        </div>

        {showIcon && (
          <div
            className={`flex items-center justify-center rounded-xl ${
              iconBackground ? "p-2" : ""
            }`}
            style={
              iconBackground ? { backgroundColor: `${color}20` } : undefined
            }
          >
            <Icon className={iconSize} style={{ color }} />
          </div>
        )}
      </div>

      {showProgress && progress !== undefined && progress >= 0 && (
        <div className="mt-5">
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      )}

      {badge && (
        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              badge.bg ?? "bg-[#FF3F3F]/10"
            } ${badge.border ?? "border-[#FF3F3F]/30"} ${
              badge.color ?? "text-[#FF3F3F]"
            }`}
          >
            {badge.icon && <badge.icon className="w-3 h-3" />}
            {badge.label}
          </span>
        </div>
      )}
    </div>
  );
}
