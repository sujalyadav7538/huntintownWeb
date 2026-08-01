export function formatLastSeen(value?: string): string {
  if (!value) return "Last seen recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Last seen recently";

  const now = Date.now();
  const diffMs = now - date.getTime();

  if (diffMs < 60_000) return "Last seen just now";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `Last seen ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last seen ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Last seen ${days}d ago`;

  return `Last seen ${date.toLocaleDateString()}`;
}

/** Returns "Today", "Yesterday", weekday name, or locale date string for the pill separator. */
export function formatDateLabel(isoString: string): string {
  const msgDate = new Date(isoString);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMsgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

  const diffDays = Math.round(
    (startOfToday.getTime() - startOfMsgDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return msgDate.toLocaleDateString(undefined, { weekday: "long" });

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: diffDays >= 365 ? "numeric" : undefined,
  });
}
