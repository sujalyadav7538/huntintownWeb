import { apiFetch } from "@/src/shared/lib/api";

type FbqFn = (
  command: "track" | "trackCustom",
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
    __metaPageViewId?: string;
  }
}

// Shared by the browser pixel and the server (Conversions API) so Meta deduplicates them.
export function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const STANDARD_EVENTS = new Set([
  "PageView",
  "CompleteRegistration",
  "Lead",
  "Contact",
  "Search",
  "ViewContent",
  "SubmitApplication",
]);

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function sendToServer(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>,
): void {
  apiFetch("/api/meta/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      params,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
    }),
  }).catch(() => undefined);
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId: string = newEventId(),
): string {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq(
        STANDARD_EVENTS.has(eventName) ? "track" : "trackCustom",
        eventName,
        params,
        { eventID: eventId },
      );
    }
    sendToServer(eventName, eventId, params);
  } catch {
    // Tracking must never break the app.
  }
  return eventId;
}

export const metaEvents = {
  pageView: () => trackMetaEvent("PageView"),
  // The browser PageView for the first load is fired in index.html; send its server copy.
  initialPageView: () => {
    const eventId = window.__metaPageViewId;
    if (!eventId) return;
    window.__metaPageViewId = undefined;
    try {
      sendToServer("PageView", eventId);
    } catch {
      // Tracking must never break the app.
    }
  },
  completeRegistration: (method: "email" | "google") =>
    trackMetaEvent("CompleteRegistration", { registration_method: method }),
  postCreated: (category?: string) =>
    trackMetaEvent("Lead", {
      content_name: "requirement_posted",
      content_category: category,
    }),
  responseSent: (postId: string) =>
    trackMetaEvent("SubmitApplication", {
      content_name: "offer_submitted",
      content_ids: [postId],
    }),
  search: (query: string, category?: string) =>
    trackMetaEvent("Search", {
      search_string: query,
      content_category: category,
    }),
  viewPost: (postId: string, title?: string, category?: string) =>
    trackMetaEvent("ViewContent", {
      content_type: "post",
      content_ids: [postId],
      content_name: title,
      content_category: category,
    }),
};
