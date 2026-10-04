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

interface NotificationResponse {
  success: boolean;
  notifications: NotificationItem[];
}

const subscribers = new Set<() => void>();

let notifications: NotificationItem[] = [];
let initializedForUser: string | null = null;
let initialization: Promise<void> | null = null;

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const setNotifications = (next: NotificationItem[]) => {
  notifications = next;
  notifySubscribers();
};

const addNotification = (notification: NotificationItem) => {
  if (notifications.some((item) => item._id === notification._id)) {
    return;
  }

  setNotifications([notification, ...notifications]);
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
  initializedForUser = null;
  initialization = null;

  notifySubscribers();
};

const initializeNotificationSystem = (userId: string) => {
  if (initializedForUser === userId && initialization) {
    return initialization;
  }

  initializedForUser = userId;
  setNotifications([]);

  initialization = apiFetchJSON<NotificationResponse>(
    "/api/notifications?limit=50",
  )
    .then((response) => {
      setNotifications(response.notifications ?? []);
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

  const currentNotifications = useSyncExternalStore(
    (subscribe) => {
      subscribers.add(subscribe);

      return () => subscribers.delete(subscribe);
    },
    () => notifications,
    () => [],
  );

  const markAsRead = async (notificationId: string) => {
    await apiFetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
    });

    setNotifications(
      notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  return {
    notifications: currentNotifications,
    markAsRead,
    enablePushNotifications: enableBrowserPush,
    renewPushNotifications: renewBrowserPush,
  };
};
