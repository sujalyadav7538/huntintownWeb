import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  buildDescription,
  buildTitle,
  isNoIndexPath,
} from "@/src/shared/lib/seo";

export interface SeoOptions {
  /** Page title without the site suffix — `useSeo` appends "· HuntInTown". */
  title?: string;
  description?: string;
  /** Canonical path; defaults to the current pathname (query strings dropped). */
  path?: string;
  /** Absolute URL or site-relative path to the share image. */
  image?: string;
  type?: "website" | "article" | "profile";
  /** Force noindex. Private routes are detected automatically. */
  noIndex?: boolean;
  /** schema.org entity for this page, injected as JSON-LD. */
  jsonLd?: Record<string, unknown> | null;
}

/** Value a tag declared in index.html had before this hook touched it. */
const originalContent = new Map<Element, string | null>();

/** Tags this hook introduced, which are removed again on cleanup. */
const createdHere = new WeakSet<Element>();

const rememberOnce = (element: Element, attribute: string) => {
  if (!originalContent.has(element)) {
    originalContent.set(element, element.getAttribute(attribute));
  }
};

const upsertMeta = (
  selectorAttribute: "name" | "property",
  key: string,
  content: string,
): Element => {
  const selector = `meta[${selectorAttribute}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(selectorAttribute, key);
    document.head.appendChild(element);
    // Nothing to restore — cleanup removes it entirely.
    createdHere.add(element);
  } else {
    rememberOnce(element, "content");
  }

  element.setAttribute("content", content);

  return element;
};

const upsertCanonical = (href: string): Element => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
    createdHere.add(element);
  } else {
    rememberOnce(element, "href");
  }

  element.setAttribute("href", href);

  return element;
};

const JSON_LD_ID = "seo-page-jsonld";

const setJsonLd = (data: Record<string, unknown> | null) => {
  document.getElementById(JSON_LD_ID)?.remove();

  if (!data) return;

  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);

  document.head.appendChild(script);
};

/**
 * Applies per-route document metadata.
 *
 * This runs in the browser, so it reaches Googlebot (which renders JS) and
 * fixes tab titles, bookmarks and history entries — but NOT the link-preview
 * bots for Slack/WhatsApp/LinkedIn/X, which read the served HTML and never
 * execute JS. Those only ever see the static tags in index.html. Making a
 * shared post or profile preview correctly needs prerendering or SSR.
 */
export function useSeo(options: SeoOptions): void {
  const location = useLocation();

  const {
    title,
    description,
    path,
    image = DEFAULT_OG_IMAGE,
    type = "website",
    noIndex,
    jsonLd = null,
  } = options;

  // Objects/functions in deps would re-run this every render; serialize instead.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const canonicalPath = path ?? location.pathname;

    const fullTitle = buildTitle(title);
    const fullDescription = buildDescription(description);
    const canonical = absoluteUrl(canonicalPath);
    const imageUrl = absoluteUrl(image);

    const shouldNoIndex = noIndex ?? isNoIndexPath(canonicalPath);

    const previousTitle = document.title;
    document.title = fullTitle;

    const touched: Element[] = [
      upsertMeta("name", "description", fullDescription),
      upsertMeta(
        "name",
        "robots",
        shouldNoIndex ? "noindex, nofollow" : "index, follow",
      ),
      upsertCanonical(canonical),

      upsertMeta("property", "og:title", fullTitle),
      upsertMeta("property", "og:description", fullDescription),
      upsertMeta("property", "og:url", canonical),
      upsertMeta("property", "og:type", type),
      upsertMeta("property", "og:image", imageUrl),
      upsertMeta("property", "og:site_name", SITE_NAME),

      upsertMeta("name", "twitter:card", "summary_large_image"),
      upsertMeta("name", "twitter:title", fullTitle),
      upsertMeta("name", "twitter:description", fullDescription),
      upsertMeta("name", "twitter:image", imageUrl),
    ];

    setJsonLd(jsonLd);

    return () => {
      document.title = previousTitle;

      // Restore what index.html declared; drop tags this hook introduced.
      for (const element of touched) {
        if (createdHere.has(element)) {
          element.remove();
          continue;
        }

        const attribute = element.tagName === "LINK" ? "href" : "content";
        const original = originalContent.get(element);

        if (original === null || original === undefined) {
          element.removeAttribute(attribute);
        } else {
          element.setAttribute(attribute, original);
        }
      }

      setJsonLd(null);
    };
  }, [
    title,
    description,
    path,
    location.pathname,
    image,
    type,
    noIndex,
    jsonLdKey,
  ]);
}
