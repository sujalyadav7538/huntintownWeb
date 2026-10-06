import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Brush,
  Car,
  GraduationCap,
  Home,
  Laptop,
  MoreHorizontal,
  Package,
  Scissors,
  Sparkles,
  Wrench,
} from "lucide-react";

// Must match backend: routes/postRoute.js MAX_POST_IMAGES and the 5 MB multer limit.
export const MAX_POST_IMAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Must match backend/models/postSchema.js limits.
export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 300;
export const BUDGET_MAX = 40;
export const TIMELINE_MAX = 40;
export const MAX_QUESTIONS = 3;
export const QUESTION_MAX = 150;

export const EXPIRY_OPTIONS = [3, 7, 14, 30];

export const POST_CATEGORIES: {
  value: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}[] = [
  { value: "home_services", label: "Home Services", icon: Home, hint: "Household help & upkeep" },
  { value: "repairs", label: "Repairs", icon: Wrench, hint: "Fix appliances & fittings" },
  { value: "technology", label: "Technology", icon: Laptop, hint: "Software, web & devices" },
  { value: "cleaning", label: "Cleaning", icon: Sparkles, hint: "Home & deep cleaning" },
  { value: "delivery", label: "Delivery", icon: Package, hint: "Pickups & drop-offs" },
  { value: "moving", label: "Moving", icon: Car, hint: "Shifting & furniture" },
  { value: "education", label: "Education", icon: GraduationCap, hint: "Tutoring & lessons" },
  { value: "design", label: "Design & Creative", icon: Brush, hint: "Graphics, photos, art" },
  { value: "business", label: "Business", icon: BriefcaseBusiness, hint: "Marketing & admin" },
  { value: "personal", label: "Personal", icon: Scissors, hint: "Errands & personal tasks" },
  { value: "other", label: "Other", icon: MoreHorizontal, hint: "Anything else" },
];

export const getCategoryLabel = (value: string) =>
  POST_CATEGORIES.find((category) => category.value === value)?.label ?? value;
