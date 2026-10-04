import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Settings,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  NotificationItem,
  useNotifications,
} from "../../hooks/useNotifications";

interface NotificationViewProps {
  notifications: NotificationItem[];
  unreadCount: number;
  permission: NotificationPermission;
  onClose: () => void;
  onPushAction: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
}

const formatTime = (value: string) => {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const NotificationIcon = ({ unread }: { unread: boolean }) => (
  <span
    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
      unread
        ? "bg-[color-mix(in_srgb,var(--app-red)_14%,transparent)] text-[var(--app-red)]"
        : "bg-[var(--app-surface-3)] text-[var(--app-text-muted)]"
    }`}
  >
    <Bell className="h-4 w-4" />
  </span>
);

const EmptyState = ({ mobile = false }: { mobile?: boolean }) => (
  <div
    className={`flex flex-col items-center justify-center px-6 text-center ${
      mobile ? "min-h-64" : "min-h-56"
    }`}
  >
    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-3)] text-[var(--app-text-muted)]">
      <Bell className="h-5 w-5" />
    </span>

    <p className="text-sm font-semibold text-[var(--app-text)]">
      No notifications yet
    </p>

    <p className="mt-1 max-w-[230px] text-xs leading-5 text-[var(--app-text-muted)]">
      New activity, responses, and updates will appear here.
    </p>
  </div>
);

const NotificationFooter = ({
  count,
  unreadCount,
  mobile = false,
}: {
  count: number;
  unreadCount: number;
  mobile?: boolean;
}) => (
  <footer
    className={`flex items-center justify-between border-t border-(--app-border) bg-(--app-surface-soft) text-[10px] text-(--app-text-muted) ${
      mobile
        ? "px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        : "px-4 py-2.5"
    }`}
  >
    <span>
      {count} notification{count === 1 ? "" : "s"}
    </span>

    {unreadCount > 0 && (
      <span className="flex items-center gap-1 text-(--app-text-muted)">
        <Check className="h-3 w-3" />
        {unreadCount} unread
      </span>
    )}
  </footer>
);

const NotificationHeader = ({
  unreadCount,
  onClose,
  mobile = false,
}: {
  unreadCount: number;
  onClose: () => void;
  mobile?: boolean;
}) => (
  <header
    className={`flex items-start justify-between border-b border-(--app-border) ${
      mobile ? "px-5 pb-4 pt-2" : "px-4 py-4"
    }`}
  >
    <div>
      <div className="flex items-center gap-2">
        <h2
          className={`font-bold text-(--app-text) ${
            mobile ? "text-lg" : "text-sm"
          }`}
        >
          Notifications
        </h2>

        {unreadCount > 0 && (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--app-red)_12%,transparent)] px-2 py-0.5 text-[10px] font-bold text-(--app-red)">
            {unreadCount} new
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-(--app-text-muted)">
        Recent activity from your account
      </p>
    </div>

    <button
      type="button"
      onClick={onClose}
      aria-label="Close notifications"
      className={`flex shrink-0 items-center justify-center text-(--app-text-muted) transition hover:bg-(--app-surface-3) hover:text-(--app-text) ${
        mobile
          ? "h-10 w-10 rounded-full bg-(--app-surface-3)"
          : "h-8 w-8 rounded-lg"
      }`}
    >
      <X className="h-4 w-4" />
    </button>
  </header>
);

const PushControl = ({
  permission,
  onPushAction,
  mobile = false,
}: {
  permission: NotificationPermission;
  onPushAction: () => void;
  mobile?: boolean;
}) => {
  if (!("Notification" in window)) {
    return null;
  }

  const enabled = permission === "granted";

  return (
    <button
      type="button"
      onClick={onPushAction}
      className={`flex items-center justify-between gap-3 border border-(--app-border) bg-(--app-surface-soft) text-left transition hover:border-(--app-border-strong) hover:bg-(--app-surface-3) ${
        mobile
          ? "mx-5 mb-4 rounded-2xl px-4 py-3.5"
          : "mx-4 my-3 rounded-2xl px-3 py-3"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--app-red)_14%,transparent)] text-(--app-red)">
          <Bell className="h-4 w-4" />
        </span>

        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-(--app-text)">
            {enabled
              ? "Push notifications enabled"
              : "Enable push notifications"}
          </span>

          <span className="mt-0.5 block truncate text-[10px] text-(--app-text-muted)">
            {enabled
              ? "Refresh your browser subscription"
              : "Stay updated even when away"}
          </span>
        </span>
      </span>

      {enabled ? (
        <Settings className="h-4 w-4 shrink-0 text-(--app-text-muted)" />
      ) : (
        <span className="shrink-0 text-[10px] font-bold text-(--app-red)">
          Enable
        </span>
      )}
    </button>
  );
};

const NotificationItemRow = ({
  notification,
  onClick,
  mobile = false,
}: {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
  mobile?: boolean;
}) => {
  const unread = !notification.isRead;

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={`group flex w-full items-start gap-3 border-b text-left transition ${
        mobile ? "px-5 py-4" : "px-4 py-3.5"
      } ${
        unread
          ? "border-[color-mix(in_srgb,var(--app-red)_22%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-red)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--app-red)_13%,transparent)]"
          : "border-[var(--app-border)] hover:bg-[var(--app-surface-3)]"
      }`}
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          unread ? "bg-[#FF3F3F]" : "bg-transparent"
        }`}
      />

      <NotificationIcon unread={unread} />

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span
            className={`line-clamp-2 text-sm leading-5 ${
              unread
                ? "font-semibold text-[var(--app-text)]"
                : "font-medium text-[var(--app-text-muted)]"
            }`}
          >
            {notification.title}
          </span>

          <span className="shrink-0 pt-0.5 text-[10px] text-[var(--app-text-muted)]">
            {formatTime(notification.createdAt)}
          </span>
        </span>

        <span className="mt-1 block line-clamp-2 text-xs leading-5 text-[var(--app-text-muted)]">
          {notification.message}
        </span>

        {notification.link && (
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--app-red)]">
            View details
            <ExternalLink className="h-3 w-3" />
          </span>
        )}
      </span>

      {notification.link && (
        <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-[var(--app-text-muted)] transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
};

const NotificationList = ({
  notifications,
  onNotificationClick,
  mobile = false,
}: {
  notifications: NotificationItem[];
  onNotificationClick: (notification: NotificationItem) => void;
  mobile?: boolean;
}) => (
  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
    {notifications.length === 0 ? (
      <EmptyState mobile={mobile} />
    ) : (
      notifications.map((notification) => (
        <NotificationItemRow
          key={notification._id}
          notification={notification}
          onClick={onNotificationClick}
          mobile={mobile}
        />
      ))
    )}
  </div>
);

const DesktopNotification = ({
  notifications,
  unreadCount,
  permission,
  onClose,
  onPushAction,
  onNotificationClick,
}: NotificationViewProps) => (
  <section
    aria-label="Notification center"
    className="
        absolute right-0 top-12 z-50
        flex max-h-[min(70vh,640px)] w-[390px]
        flex-col overflow-hidden
        rounded-2xl
        border border-[var(--app-border)]
        bg-[var(--app-surface)]
        shadow-2xl
        "
  >
    <NotificationHeader unreadCount={unreadCount} onClose={onClose} />

    <PushControl permission={permission} onPushAction={onPushAction} />

    <NotificationList
      notifications={notifications}
      onNotificationClick={onNotificationClick}
    />

    {notifications.length > 0 && (
      <NotificationFooter
        count={notifications.length}
        unreadCount={unreadCount}
      />
    )}
  </section>
);

const MobileNotification = ({
  notifications,
  unreadCount,
  permission,
  onClose,
  onPushAction,
  onNotificationClick,
}: NotificationViewProps) =>
  createPortal(
    <>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-black/45 backdrop-blur-[2px]"
        data-notification-modal="true"
      />

      <section
        aria-label="Notification center"
        data-notification-modal="true"
        className="fixed inset-0 z-[1001] flex flex-col overflow-hidden bg-[var(--app-surface)]"
      >
        <div className="flex justify-center pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <span className="h-1 w-10 rounded-full bg-[var(--app-border-strong)]" />
        </div>

        <NotificationHeader
          unreadCount={unreadCount}
          onClose={onClose}
          mobile
        />

        <PushControl
          permission={permission}
          onPushAction={onPushAction}
          mobile
        />

        <NotificationList
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          mobile
        />

        {notifications.length > 0 && (
          <NotificationFooter
            count={notifications.length}
            unreadCount={unreadCount}
            mobile
          />
        )}
      </section>
    </>,
    document.body,
  );

const Notification = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const {
    notifications,
    markAsRead,
    enablePushNotifications,
    renewPushNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );

  const [permission, setPermission] = useState<NotificationPermission>(() =>
    "Notification" in window ? window.Notification.permission : "default",
  );

  /* ------------------------------ Derived Data ---------------------------- */

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  /* ------------------------------ Push Logic ------------------------------ */

  const handlePushAction = async () => {
    if (!("Notification" in window)) {
      return;
    }

    try {
      if (window.Notification.permission === "granted") {
        await renewPushNotifications();
      } else {
        await enablePushNotifications();
      }

      setPermission(window.Notification.permission);
    } catch (error) {
      console.error("[Notifications] Push setup failed:", error);
    }
  };

  /* --------------------------- Notification Logic ------------------------- */

  const handleNotificationClick = async (notification: NotificationItem) => {
    try {
      await markAsRead(notification._id);

      setIsOpen(false);

      if (!notification.link) {
        return;
      }

      if (/^https?:\/\//i.test(notification.link)) {
        window.location.assign(notification.link);
        return;
      }

      navigate(notification.link);
    } catch (error) {
      console.error("[Notifications] Failed to handle notification:", error);
    }
  };

  /* ------------------------------ UI Events ------------------------------- */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = () => setIsMobile(mediaQuery.matches);

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    if (!isOpen) {
      return () => mediaQuery.removeEventListener("change", handleViewportChange);
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;

      if (!target) {
        return;
      }

      // Don't close when clicking inside the notification modal.
      if (target.closest("[data-notification-modal='true']")) {
        return;
      }

      // Don't close when clicking inside the notification button/container.
      if (ref.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /* ------------------------------- Props ---------------------------------- */

  const viewProps: NotificationViewProps = {
    notifications,
    unreadCount,
    permission,
    onClose: () => setIsOpen(false),
    onPushAction: handlePushAction,
    onNotificationClick: handleNotificationClick,
  };

  /* -------------------------------- Render -------------------------------- */

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="
          relative flex h-10 w-10
          items-center justify-center
          rounded-full
          text-(--app-text-muted)
          transition
          hover:bg-(--app-surface-3)
        "
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-0.5 -top-0.5
              flex min-w-5
              items-center justify-center
              rounded-full
              bg-[#FF3F3F]
              px-1 py-0.5
              text-[10px]
              font-bold
              text-white
              ring-2
              ring-[var(--app-surface)]
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        isMobile ? (
          <MobileNotification {...viewProps} />
        ) : (
          <DesktopNotification {...viewProps} />
        )
      )}
    </div>
  );
};

export default Notification;
