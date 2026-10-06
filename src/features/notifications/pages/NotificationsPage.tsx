import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ChevronRight, Trash2, X } from "lucide-react";

import { apiFetchJSON } from "@/src/shared/lib/api";
import { useSeo } from "@/src/shared/hooks/useSeo";
import {
  NOTIFICATION_TYPE_LABELS,
  NotificationItem,
  NotificationResponse,
  clearRead,
  deleteNotification,
  markAllAsRead,
  markAsRead,
  resolveNotificationLink,
  useNotifications,
} from "@/src/shared/hooks/useNotifications";

const PAGE_SIZE = 20;
const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
] as const;
const TYPE_FILTERS = ["", "RESPONSE", "OFFER", "MESSAGE", "POST", "RATING"];

type StatusFilter = (typeof STATUS_TABS)[number]["value"];

const formatTime = (value: string) => {
  const date = new Date(value);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  useSeo({ title: "Notifications" });

  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState("");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const requestId = useRef(0);

  const fetchPage = useCallback(
    (pageToLoad: number) => {
      const params = new URLSearchParams({
        page: String(pageToLoad),
        limit: String(PAGE_SIZE),
        status,
      });
      if (type) params.set("type", type);
      return apiFetchJSON<NotificationResponse>(`/api/notifications?${params}`);
    },
    [status, type],
  );

  const loadFirstPage = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const data = await fetchPage(1);
      if (id !== requestId.current) return;
      setItems(data.notifications ?? []);
      setHasMore(Boolean(data.hasMore));
      setTotal(data.total ?? 0);
      setPage(1);
    } catch (cause) {
      if (id !== requestId.current) return;
      setError(
        cause instanceof Error ? cause.message : "Could not load notifications.",
      );
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = async () => {
    const id = requestId.current;
    setLoadingMore(true);
    try {
      const data = await fetchPage(page + 1);
      if (id !== requestId.current) return;
      setItems((prev) => {
        const seen = new Set(prev.map((item) => item._id));
        return [
          ...prev,
          ...(data.notifications ?? []).filter((item) => !seen.has(item._id)),
        ];
      });
      setHasMore(Boolean(data.hasMore));
      setPage((current) => current + 1);
    } catch {
      // Leave the button visible so the user can retry.
    } finally {
      setLoadingMore(false);
    }
  };

  const handleOpen = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification._id).catch(() => undefined);
    }
    const target = resolveNotificationLink(notification);
    if (target) navigate(target);
  };

  const handleDelete = async (notification: NotificationItem) => {
    try {
      await deleteNotification(notification._id, !notification.isRead);
      setItems((prev) => prev.filter((item) => item._id !== notification._id));
      setTotal((count) => Math.max(0, count - 1));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Delete failed.");
    }
  };

  const handleMarkAllRead = async () => {
    setBusy(true);
    try {
      await markAllAsRead();
      if (status === "unread") {
        setItems([]);
        setTotal(0);
        setHasMore(false);
      } else {
        setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleClearRead = async () => {
    if (!window.confirm("Delete all read notifications?")) return;
    setBusy(true);
    try {
      await clearRead();
      await loadFirstPage();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Clear failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="theme-page-shell mx-auto w-full max-w-3xl space-y-5 px-1 py-5 sm:py-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF3F3F]">
            Activity
          </p>
          <h1 className="theme-text-primary mt-1 flex items-center gap-2 font-display text-xl font-bold">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#FF3F3F]/12 px-2 py-0.5 text-[10px] font-bold text-[#FF3F3F]">
                {unreadCount} new
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={busy || unreadCount === 0}
            className="theme-chip inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-40"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
          <button
            type="button"
            onClick={handleClearRead}
            disabled={busy}
            className="theme-chip inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear read
          </button>
        </div>
      </header>

      <div className="space-y-3">
        <nav
          aria-label="Filter by read status"
          className="theme-divider flex gap-1 border-b"
        >
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
              className={`border-b-2 px-3 py-2 text-[11px] font-semibold transition ${
                status === value
                  ? "border-[#FF3F3F] theme-text-primary"
                  : "theme-text-muted border-transparent hover:text-[#FF3F3F]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div
          aria-label="Filter by type"
          className="flex gap-1.5 overflow-x-auto scrollbar-hide"
        >
          {TYPE_FILTERS.map((value) => (
            <button
              key={value || "ALL"}
              type="button"
              aria-pressed={type === value}
              onClick={() => setType(value)}
              className={`shrink-0 rounded-xl border px-3 py-1.5 text-[10px] font-semibold transition ${
                type === value ? "theme-chip-active" : "theme-chip"
              }`}
            >
              {value ? NOTIFICATION_TYPE_LABELS[value] : "All types"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-[#FF3F3F]/30 bg-[#FF3F3F]/10 px-3 py-2 text-xs text-[#FF6B6B]">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="theme-explore-skeleton h-20 animate-pulse rounded-xl border"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-(--app-surface-3) text-(--app-text-muted)">
            <Bell className="h-5 w-5" />
          </span>
          <p className="theme-text-primary text-sm font-semibold">
            No notifications here
          </p>
          <p className="theme-text-muted mt-1 max-w-xs text-xs">
            {status === "unread"
              ? "You're all caught up."
              : "Responses, offers, messages and ratings will appear here."}
          </p>
        </div>
      ) : (
        <>
          <p className="theme-text-muted text-[11px]">
            Showing {items.length} of {total}
          </p>

          <ul className="space-y-2">
            {items.map((notification) => {
              const unread = !notification.isRead;
              const link = resolveNotificationLink(notification);

              return (
                <li
                  key={notification._id}
                  className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
                    unread
                      ? "border-[#FF3F3F]/25 bg-[#FF3F3F]/6"
                      : "theme-card"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      unread ? "bg-[#FF3F3F]" : "bg-transparent"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => handleOpen(notification)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm ${
                          unread
                            ? "theme-text-primary font-semibold"
                            : "theme-text-muted font-medium"
                        }`}
                      >
                        {notification.title}
                      </span>
                      <span className="theme-text-muted rounded-full border border-(--app-border) px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide">
                        {NOTIFICATION_TYPE_LABELS[notification.type] ??
                          notification.type}
                      </span>
                    </span>

                    <span className="theme-text-muted mt-1 block text-xs leading-5">
                      {notification.message}
                    </span>

                    <span className="theme-text-muted mt-1.5 flex items-center gap-2 text-[10px]">
                      {formatTime(notification.createdAt)}
                      {link && (
                        <span className="inline-flex items-center gap-0.5 font-semibold text-[#FF3F3F]">
                          Open
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(notification)}
                    aria-label="Delete notification"
                    className="theme-icon-muted theme-hover-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="theme-chip rounded-full border px-4 py-1.5 text-[11px] font-semibold transition disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
