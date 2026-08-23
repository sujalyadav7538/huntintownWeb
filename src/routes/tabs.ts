export const PROTECTED_TABS = [
  "feed",
  "dashboard",
  "messaging",
  "profile",
  "activity",
  "responses",
] as const;

export type ProtectedTab = (typeof PROTECTED_TABS)[number];

export function isProtectedTab(tab: string): tab is ProtectedTab {
  return (PROTECTED_TABS as readonly string[]).includes(tab);
}

export function getActiveTabFromPath(pathname: string): string {
  const clean = pathname.replace(/^\//, "");
  return clean || "landing";
}

export function getPathFromTab(tab: string): string {
  return tab === "landing" ? "/" : `/${tab}`;
}
