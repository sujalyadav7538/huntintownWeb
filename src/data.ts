import {
  Coins,
  Compass,
  Crown,
  Gem,
  MessageSquare,
  Percent,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserIcon,
  Wrench,
} from "lucide-react";
import { UserMetric } from "./types";
import { LucideIcon } from "lucide-react";

export interface MetricConfig {
  title: string;
  value: string | number | ((metric: UserMetric | number) => string | number);
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  progress?: number | ((metric: UserMetric) => number);
  trend?: string;
  size?: "md" | "sm" | "lg";
  showProgress?: boolean;
  badge?:
    | ((metric: UserMetric) => {
        label: string;
        color?: string;
        bg?: string;
        border?: string;
        bar?: string;
        icon?: LucideIcon;
      })
    | null;
  className?: string;
}

export const trustMetrics: MetricConfig[] = [
  {
    title: "Trust Score",
    value: (m: UserMetric | null) => `${m?.trustScore?.toFixed(0) ?? 0} / 100`,
    progress: (m: UserMetric | null) => m?.trustScore ?? 0,
    icon: Shield,
    color: "#FF3F3F",
    size: "md",
    subtitle: "Community trust",
    badge: (m: UserMetric | null) => getTrustLevel(m?.trustScore ?? 0),
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",
  },
] as const;

export const commonMetrics: MetricConfig[] = [
  {
    title: "Rating",
    value: (m: UserMetric | null) =>
      `${m?.reviewMetrics.averageRating?.toFixed(1) ?? "0.0"} / 5`,
    progress: (m: UserMetric | null) =>
      ((m?.reviewMetrics.averageRating ?? 0) / 5) * 100,
    subtitle: "Review Score",
    icon: Star,
    color: "#F59E0B",
    size: "md",
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
  {
    title: "Profile",
    value: (m: UserMetric | null) => `${m?.profileMetrics?.completion ?? 0}%`,
    progress: (m: UserMetric | null) => m?.profileMetrics?.completion ?? 0,
    subtitle: "Completion Rate",
    icon: UserIcon,
    color: "#3B82F6",
    size: "md",
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
] as const;

export const helperMetrics: MetricConfig[] = [
  {
    title: "ACCEPT RATE",
    value: (m: UserMetric | null) =>
      m?.helperMetrics?.acceptanceScore.toFixed(0) + "%",

    subtitle: "Offer Acceptance",
    icon: Percent,
    color: "#2dd4bf",
    size: "sm",
    showProgress: false,
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
  {
    title: "COMPLETION RATE",
    value: (m: UserMetric | null) =>
      m?.helperMetrics?.completionScore.toFixed(0) + "%",
    subtitle: "Offer Acceptance",
    icon: TrendingUp,
    color: "#f472b6",
    size: "sm",
    showProgress: false,
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
] as const;

export const hunterMetrics: MetricConfig[] = [
  {
    title: "ACCEPT RATE",
    value: (m: UserMetric | null) =>
      m?.hunterMetrics?.acceptanceScore.toFixed(0) + "%",

    subtitle: "Offer Acceptance",
    icon: Percent,
    color: "#2dd4bf",
    size: "sm",
    showProgress: false,
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
  {
    title: "COMPLETION RATE",
    value: (m: UserMetric | null) =>
      m?.hunterMetrics?.completionScore.toFixed(0) + "%",
    subtitle: "finish rate",
    icon: TrendingUp,
    color: "#f472b6",
    size: "sm",
    showProgress: false,
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
  {
    title: "POSTS CREATED",
    value: (m: UserMetric | null) =>
      m?.hunterMetrics?.completionScore.toFixed(0) + "%",
    subtitle: "total posted",
    icon: Target,
    color: "#FF3F3F",
    size: "sm",
    showProgress: false,
    className: "sm:border sm:border-[#232327] sm:bg-[#1e1e1f]",

  },
] as const;

export function getTrustLevel(trustScore: number) {
  if (trustScore >= 90) {
    return {
      label: "Legend",
      icon: Crown,
      color: "text-yellow-300",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      bar: "#FACC15",
    };
  }

  if (trustScore >= 75) {
    return {
      label: "Elite",
      icon: Gem,
      color: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      bar: "#22D3EE",
    };
  }

  if (trustScore >= 55) {
    return {
      label: "Trusted",
      icon: ShieldCheck,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      bar: "#22C55E",
    };
  }

  if (trustScore >= 30) {
    return {
      label: "Rising",
      icon: Sparkles,
      color: "text-violet-300",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      bar: "#8B5CF6",
    };
  }

  return {
    label: "New",
    icon: Sparkles,
    color: "text-zinc-300",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    bar: "#71717A",
  };
}

export const heroSectionStats: MetricConfig[] = [
  {
    title: "Active Requests",
    value: (activePosts: number) => activePosts,
    subtitle: "People currently looking for local help",
    icon: Compass,
    color: "#FF3F3F",
    className: "border border-[#232327] bg-[#1e1e1f]",
    // badge: {
    //   label: "LIVE",
    //   color: "text-red-400",
    //   bg: "bg-red-500/10",
    //   border: "border-red-500/20",
    // },
  },
  {
    title: "Verified Helpers",
    value: "12+",
    subtitle: "Trusted community members",
    icon: Wrench,
    color: "#38BDF8",
    className: "border border-[#232327] bg-[#1e1e1f]",
    // badge: {
    //   label: "Verified",
    //   color: "text-sky-400",
    //   bg: "bg-sky-500/10",
    //   border: "border-sky-500/20",
    // },
  },
  // {
  //   title: "Platform Fee",
  //   value: "0%",
  //   subtitle: "Keep every rupee you earn",
  //   icon: Coins,
  //   color: "#F59E0B",
  //   // badge: {
  //   //   label: "No Commission",
  //   //   color: "text-amber-400",
  //   //   bg: "bg-amber-500/10",
  //   //   border: "border-amber-500/20",
  //   // },
  // },
  // {
  //   title: "Trust System",
  //   value: "Live",
  //   subtitle: "Ratings • Badges • Reputation",
  //   icon: ShieldCheck,
  //   color: "#10B981",
  //   // badge: {
  //   //   label: "Enabled",
  //   //   color: "text-emerald-400",
  //   //   bg: "bg-emerald-500/10",
  //   //   border: "border-emerald-500/20",
  //   // },
  // },
];
