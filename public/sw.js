self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    console.warn("[ServiceWorker] Push event had no data");
    return;
  }

  let data;

  try {
    data = event.data.json();
  } catch (error) {
    console.error("[ServiceWorker] Invalid push payload:", error);
    return;
  }

  const notificationId = String(data.notificationId || data.id || "");

  console.info("[ServiceWorker] Push received", {
    notificationId,
    title: data.title,
  });

  const notification = {
    _id: notificationId,
    id: notificationId,
    type: data.type || "SYSTEM",
    action: data.action || "PUSH_RECEIVED",
    title: data.title || "HuntInTown",
    message: data.message || "",
    data: data.data || {},
    link: data.link || null,
    isRead: false,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  const options = {
    body: data.message || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      notificationId,
      link: data.link,
      ...data.data,
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration
        .showNotification(data.title || "HuntInTown", options)
        .catch((error) => {
          console.error("[ServiceWorker] Failed to show notification:", error);

          throw error;
        }),

      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "PUSH_NOTIFICATION",
              notification,
            });
          });
        }),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link;

  if (!link) {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(link);
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(link);
        }
      }),
  );
});
