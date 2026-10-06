import { useEffect, useSyncExternalStore } from "react";
import { apiFetch, apiFetchJSON } from "../lib/api";
import { useAppSelector } from "../../store/hooks";

export interface NotificationItem {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: string;
  action: string;
  data?: Record<string, unknown>;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: NotificationItem[];
  unreadCount?: number;
  hasMore?: boolean;
  total?: number;
  page?: number;
}

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  RESPONSE: "Responses",
  OFFER: "Offers",
  MESSAGE: "Messages",
  POST: "Posts",
  RATING: "Ratings",
  SYSTEM: "System",
};

// Maps a notification to an in-app route; also rewrites links stored before routes were fixed.
export const resolveNotificationLink = (
  notification: NotificationItem,
): string | null => {
  const data = (notification.data ?? {}) as Record<string, unknown>;
  const link = notification.link ?? "";

  switch (notification.action) {
    case "NEW_MESSAGE":
      return data.conversationId
        ? `/messaging?conversationId=${encodeURIComponent(String(data.conversationId))}`
        : "/messaging";
    case "NEW_RESPONSE":
    case "OFFER_RECEIVED":
    case "POST_EXPIRING":
    case "POST_EXPIRED":
      return "/dashboard";
    case "OFFER_ACCEPTED":
    case "OFFER_REJECTED":
      return "/dashboard?view=submitted";
    case "RATING_RECEIVED":
      return link.replace(/\/ratings$/, "") || "/profile";
  }

  // Only same-origin paths are followed, never external URLs.
  return link.startsWith("/") && !link.startsWith("//") ? link : null;
};

const subscribers = new Set<() => void>();

let notifications: NotificationItem[] = [];
let unreadCount = 0;
let snapshot = { notifications, unreadCount };
let initializedForUser: string | null = null;
let initialization: Promise<void> | null = null;

const notifySubscribers = () => {
  snapshot = { notifications, unreadCount };
  subscribers.forEach((subscriber) => subscriber());
};

const setNotifications = (next: NotificationItem[], nextUnread = unreadCount) => {
  notifications = next;
  unreadCount = Math.max(0, nextUnread);
  notifySubscribers();
};

const addNotification = (notification: NotificationItem) => {
  if (notifications.some((item) => item._id === notification._id)) {
    return;
  }

  setNotifications(
    [notification, ...notifications],
    unreadCount + (notification.isRead ? 0 : 1),
  );
};

const urlBase64ToUint8Array = (value: string): Uint8Array => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");

  const raw = window.atob(base64);

  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
};

const registerBrowserPush = async (forceRenew = false) => {
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;
  if (!("Notification" in window)) return;

  const registration = await navigator.serviceWorker.register("/sw.js");

  await navigator.serviceWorker.ready;

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return;
  }

  let subscription = await registration.pushManager.getSubscription();

  if (subscription && forceRenew) {
    await subscription.unsubscribe();
    subscription = null;
  }

  if (!subscription) {
    const { publicKey } = await apiFetchJSON<{
      publicKey?: string;
    }>("/api/notifications/vapid-public-key");

    if (!publicKey) {
      throw new Error("VAPID public key is not configured");
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });
  }

  console.info("[Notifications] Push subscription ready", {
    endpoint: subscription.endpoint,
    permission,
  });

  const response = await apiFetch("/api/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Push subscription registration failed (${response.status}): ${body}`,
    );
  }

  console.info("[Notifications] Push subscription saved");
};

export const enableBrowserPush = async () => {
  await registerBrowserPush();
};

export const renewBrowserPush = async () => {
  await registerBrowserPush(true);
};

export const resetNotifications = () => {
  notifications = [];
  unreadCount = 0;
  initializedForUser = null;
  initialization = null;

  notifySubscribers();
};

const initializeNotificationSystem = (userId: string) => {
  if (initializedForUser === userId && initialization) {
    return initialization;
  }

  initializedForUser = userId;
  setNotifications([], 0);

  initialization = apiFetchJSON<NotificationResponse>(
    "/api/notifications?limit=30",
  )
    .then((response) => {
      const list = response.notifications ?? [];
      setNotifications(
        list,
        response.unreadCount ?? list.filter((item) => !item.isRead).length,
      );
    })
    .catch((error) => {
      console.error("[Notifications] Failed to load notifications:", error);
    });

  return initialization;
};

export const useNotifications = () => {
  const currentUserId = useAppSelector(
    (state) => state.auth.currentUser?._id ?? state.auth.currentUser?.id,
  );

  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_NOTIFICATION") {
        return;
      }

      const notification = event.data.notification as NotificationItem;

      if (notification?._id) {
        addNotification(notification);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      void initializeNotificationSystem(currentUserId);
    } else {
      resetNotifications();
    }
  }, [currentUserId]);

  const current = useSyncExternalStore(
    (subscribe) => {
      subscribers.add(subscribe);

      return () => subscribers.delete(subscribe);
    },
    () => snapshot,
    () => snapshot,
  );

  return {
    notifications: current.notifications,
    unreadCount: current.unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearRead,
    enablePushNotifications: enableBrowserPush,
    renewPushNotifications: renewBrowserPush,
  };
};

/* Mutations: call the API, then mirror the change into the shared store. */

export const markAsRead = async (notificationId: string) => {
  const res = await apiFetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Could not mark notification as read");

  const target = notifications.find((item) => item._id === notificationId);
  setNotifications(
    notifications.map((item) =>
      item._id === notificationId ? { ...item, isRead: true } : item,
    ),
    target && !target.isRead ? unreadCount - 1 : unreadCount,
  );
};

export const markAllAsRead = async () => {
  const res = await apiFetch("/api/notifications/read-all", { method: "PATCH" });
  if (!res.ok) throw new Error("Could not mark notifications as read");

  setNotifications(
    notifications.map((item) => ({ ...item, isRead: true })),
    0,
  );
};

export const deleteNotification = async (
  notificationId: string,
  wasUnread = false,
) => {
  const res = await apiFetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Could not delete notification");

  const target = notifications.find((item) => item._id === notificationId);
  const unread = target ? !target.isRead : wasUnread;
  setNotifications(
    notifications.filter((item) => item._id !== notificationId),
    unread ? unreadCount - 1 : unreadCount,
  );
};

export const clearRead = async () => {
  const res = await apiFetch("/api/notifications/read", { method: "DELETE" });
  if (!res.ok) throw new Error("Could not clear notifications");

  setNotifications(notifications.filter((item) => !item.isRead), unreadCount);
};
