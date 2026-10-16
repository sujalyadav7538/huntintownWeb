# Neighbourly — Hyperlocal Community Exchange Platform

A full-featured React/TypeScript single-page application originally built in Google AI Studio, representing a hyperlocal neighbourhood skill-exchange and task-posting platform (think "neighbourhood Craigslist" with structured proposals, messaging, and a reputation system).

This README documents the full project structure, tech stack, and a refactoring roadmap for converting the AI Studio prototype into clean, modular, production-ready code.

> **Original AI Studio link:** https://ai.studio/apps/1cb42ebc-e12a-4301-9da4-ed62cab72b04

---

## Route-based screen navigation

The current Vite app uses `BrowserRouter` from `src/main.tsx`. Page-like detail
views are URL-driven rather than local-state modals:

- `/post/:id` opens a requirement from Explore, the home page, a profile, or the map.
- `/post/:id/apply` opens its application form (sign-in required).
- `/dashboard?postId=:id` shows received offers; `&response=:id` opens one offer.
  Both the published requirement's eye button and offer count open this view.
  Dashboard detail views appear as bottom sheets on mobile and pages on desktop.
  Their URLs remain in browser history, so Back dismisses the current sheet.
- `/dashboard?offer=:id` shows a submitted offer; `?rate=:postId` opens helper ratings.
- Existing `?ratePost=:postId` notification links still open the submitted offer.
- Profile query parameters select `tab`, `edit=basic|portfolio`,
  `showcase=:itemId`, or `highlight=create`.
- `/login?mode=signup` opens signup; `&terms=view` opens its terms without a modal.
- `/help` provides common questions and task links; `/contact` lists support,
  general enquiry, and privacy/safety contacts. Footer support links open these
  public pages rather than immediately launching an email app.
  Both pages reset the app's scroll container to the top when opened.
- Messaging post/thread selections push history entries and are restored from the URL.
- Message notification deep links use conversation ownership to select My Posts
  or My Chats, correcting older links without adding an extra history entry.

Browser/device Back and Forward traverse these screens. In-page Back uses router
history when available and a parent-screen fallback for a fresh deep link.
Signed-in users can open Chat from the mobile header beside notifications; unread
messages show a count badge on the shortcut.
Reloading a detail URL reloads its data; missing records display an explicit error.
Explore keeps its search and category in `q` and `category` when opening a post.
Small transient controls (confirmation dialogs, image cropping, menus, and map
previews) remain overlays, not separate pages.

Create-post dropdowns automatically open above their field when space below is
limited. Their height stays within the visible scroll area and adapts to viewport
changes, including the mobile keyboard.

## Theme preference

Light is the default theme, regardless of the device's system theme. Users can
switch to dark mode; their saved preference is restored on subsequent visits.
In light mode, entered form values use the primary dark text color while
placeholders stay muted.

## SEO

Public requirement pages are indexable after their data loads. Application
forms, profiles, account pages, and dashboard/chat screens remain noindex;
failed post loads are also noindex. Canonicals omit query strings.
The build generates a sitemap for the static public pages, including Help Center
and Contact Us. Dynamic requirements are discovered through links rather than
listed in this static sitemap. Help Center includes FAQ structured data matching
its visible answers; Contact Us includes organization contact structured data.

Route metadata is applied in the browser. Per-post social previews still require
server-side rendering or prerendering; unknown URLs also require server-side
status handling for true HTTP 404 responses.

Profile photo and cover uploads support drag-to-position and zoom before
confirmation. Covers use a 4:1 crop saved as a 1600 x 400 JPEG; profile photos
remain 400 x 400. Cancelling a crop leaves the existing photo unchanged.

Applications require confirmation before submission and can only be submitted
once per requirement. Cancelling confirmation preserves the application draft.
On small screens, the highlight creation button uses the shorter label "Create".

## Table of Contents

1. [What the App Does](#what-the-app-does)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Data Models](#core-data-models)
5. [App State & Routing](#app-state--routing)
6. [Component Inventory](#component-inventory)
7. [Known Issues (AI Studio Prototype)](#known-issues-ai-studio-prototype)
8. [Refactoring Roadmap](#refactoring-roadmap)
9. [Running the App](#running-the-app)

---

## What the App Does

**Neighbourly** is a community marketplace where residents can:

- **Post requirements** — request help (e.g. "Need a plumber", "Interior design consultation") with optional custom screening questions, budget, and expiry date (max 10 days).
- **Browse the feed** — filter posts by category, search by keyword, view post details and submit a structured proposal/offer.
- **Dashboard** — manage your own published listings; mark them as fulfilled, cancelled, or delete them. View incoming proposals.
- **Messaging** — direct chat system with conversation threads per user.
- **Profile** — view and edit your own profile (name, bio, skills, location, avatar).
- **Landing page** — marketing-style home page showcasing active posts, local specialists, and a platform trust charter.
- **Mobile simulation** — a desktop toggle to simulate mobile viewport for responsive testing.

All data is persisted to `localStorage` (no backend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | **Vite** (with `@tailwindcss/vite` plugin) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `index.css`) |
| Routing | `react-router-dom` v7 (HashRouter) |
| Icons | `lucide-react` |
| Animation | `motion` (Framer Motion v12) |
| Fonts | Plus Jakarta Sans, Space Grotesk, JetBrains Mono (Google Fonts) |
| Persistence | Browser `localStorage` |

> **Note:** `package.json` also lists `next` as a dependency — a leftover from AI Studio scaffolding. The actual runtime is **Vite**, not Next.js. The `src/app/` directory and `src/context/AppContext.tsx` contain Next.js-flavoured code (`"use client"`, `usePathname`, `useRouter`) that is currently unused by the Vite entry point.

---

## Project Structure

```
ranthetown/
├── index.html                  # Vite HTML entry
├── vite.config.ts              # Vite + Tailwind + React plugin config
├── tsconfig.json
├── package.json
│
├── src/
│   ├── main.tsx                # React root — mounts <App> inside HashRouter
│   ├── App.tsx                 # Root component: all state, routing logic, layout
│   ├── types.ts                # Shared TypeScript interfaces (User, Post, Comment…)
│   ├── data.ts                 # Seed / mock data (INITIAL_USER, INITIAL_POSTS, MOCK_USERS…)
│   ├── utils.ts                # Pure helpers (isPostExpired, getPostExpiryLabel)
│   ├── index.css               # Tailwind entry + global styles + custom scrollbars
│   │
│   ├── components/             # Feature components (all receive state via props)
│   │   ├── Header.tsx
│   │   ├── LandingPage.tsx
│   │   ├── HomeFeed.tsx
│   │   ├── CreatePost.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Messaging.tsx
│   │   ├── ProfileView.tsx
│   │   ├── LoginModal.tsx
│   │   ├── LoginPage.tsx
│   │   ├── LaunchSoonPage.tsx
│   │   │
│   │   ├── create-post/        # Sub-components for the CreatePost form
│   │   │   ├── ContactMethodsToggle.tsx
│   │   │   ├── CustomQuestionsInput.tsx
│   │   │   └── ImageUploadArea.tsx
│   │   │
│   │   ├── dashboard/          # Sub-components for Dashboard view
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ProposalsSidebar.tsx
│   │   │   └── PublishedListingItem.tsx
│   │   │
│   │   ├── feed/               # Sub-components for HomeFeed view
│   │   │   ├── CategoryFilterRow.tsx
│   │   │   ├── FeedSidebar.tsx
│   │   │   ├── MobileSearchBar.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── PostDetailModal.tsx
│   │   │
│   │   ├── header/             # Sub-components for Header
│   │   │   ├── DesktopNavbar.tsx
│   │   │   ├── SimulatorControls.tsx
│   │   │   └── UserProfileIndicator.tsx
│   │   │
│   │   └── messaging/          # Sub-components for Messaging view
│   │       ├── ChatHeader.tsx
│   │       ├── ChatList.tsx
│   │       ├── MessageBubble.tsx
│   │       └── MessageInput.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx      # (Unused in Vite build) Next.js Context provider draft
│   │
│   └── app/                    # (Unused in Vite build) Next.js App Router pages
│       ├── layout.tsx
│       ├── page.tsx
│       ├── dashboard/page.tsx
│       ├── feed/page.tsx
│       ├── login/page.tsx
│       ├── messaging/page.tsx
│       └── profile/page.tsx
│
└── assets/                     # Static assets
```

---

## Core Data Models

Defined in `src/types.ts`:

```ts
User         — id, name, avatar, role, location, rating, reputation, skills, bio
Post         — id, title, description, category, location, type (help_needed | skill_offered),
               budget, author, createdAt, expiresAt, status (open | fulfilled | cancelled),
               questions[], comments[], offersCount
Comment      — id, postId, author, content, isOffer, offerBudget, offerDuration, answers[]
Message      — id, senderId, receiverId, content, createdAt, read
Conversation — id, participant, messages[], lastMessage, unreadCount
```

---

## App State & Routing

All global state lives in `App.tsx` and is passed down as props. Routes map to tab strings via `react-router-dom` HashRouter:

| Path | Tab | Component |
|---|---|---|
| `/` | `landing` | `<LandingPage>` |
| `/feed` | `feed` | `<HomeFeed>` |
| `/dashboard` | `dashboard` | `<Dashboard>` |
| `/messaging` | `messaging` | `<Messaging>` |
| `/profile` | `profile` | `<ProfileView>` |
| `/login` | `login` | `<LoginPage>` |

State is synced to `localStorage` via `useEffect` watchers for `currentUser`, `posts`, and `conversations`.

---

## Component Inventory

| Component | Responsibility |
|---|---|
| `Header` | Top navigation bar, mobile toggle, unread message badge |
| `LandingPage` | Marketing hero, active post map pins, specialist carousel, trust charter |
| `HomeFeed` | Post listing with category filter, search, sidebar, and post detail modal |
| `CreatePost` | Multi-step form: title, category, type, budget, expiry, custom questions |
| `Dashboard` | User's own listings, proposal inbox, status controls |
| `Messaging` | Chat list + active conversation thread |
| `ProfileView` | Profile display + inline edit form |
| `LoginModal` / `LoginPage` | Simulated login (select a mock user from seed data) |
| `PostDetailModal` | Full post view with offer submission form |
| `PostCard` | Feed card with expiry badge, category chip, budget tag |

---

## Known Issues (AI Studio Prototype)

1. **Dual framework conflict** — `package.json` scripts were pointing to `next dev` but the app is Vite. *(Fixed: scripts now use `vite`.)*
2. **`src/app/` and `src/context/AppContext.tsx`** — Next.js App Router files that are scaffolded but never wired up. They duplicate logic already in `App.tsx`.
3. **All state in `App.tsx`** — The root component holds every piece of state and passes it through multiple prop layers (prop drilling). Needs Context or a state manager.
4. **No real auth** — Login is simulated by selecting a mock user from `data.ts`.
5. **No backend** — Everything lives in `localStorage`; data resets if storage is cleared.
6. **`next` in dependencies** — The `next` package is an unused dependency bloating `node_modules`.

---

## Refactoring Roadmap

To convert this into clean, modular, maintainable code:

### Phase 1 — Clean up AI Studio scaffolding
- [ ] Remove `src/app/` directory (unused Next.js pages)
- [ ] Remove `next`, `express`, `dotenv` from `dependencies` (not used by Vite SPA)
- [ ] Delete `next-env.d.ts`
- [ ] Keep `src/context/AppContext.tsx` as the foundation for Phase 2

### Phase 2 — Extract global state into Context
- [ ] Promote `AppContext.tsx` as the active provider (replace prop drilling in `App.tsx`)
- [ ] Wrap `<App>` with `<AppContextProvider>` in `main.tsx`
- [ ] Replace all prop-passed state in child components with `useAppContext()` hook
- [ ] Split context into smaller slices if needed: `usePostsContext`, `useMessagingContext`

### Phase 3 — Custom hooks
- [ ] `usePosts()` — CRUD for posts, filtering, expiry logic
- [ ] `useMessaging()` — conversations, send/read messages
- [ ] `useAuth()` — current user, login/logout simulation
- [ ] `useLocalStorage<T>()` — generic localStorage sync hook

### Phase 4 — Feature-based folder structure
```
src/
├── features/
│   ├── feed/
│   ├── dashboard/
│   ├── messaging/
│   ├── profile/
│   └── create-post/
├── shared/
│   ├── components/    (Header, PostCard, etc.)
│   ├── hooks/
│   ├── context/
│   └── utils/
├── types.ts
└── data/
    └── seed.ts
```

### Phase 5 — Type safety & validation
- [ ] Add `zod` schemas for `Post` and `User` to validate localStorage reads
- [ ] Strict null checks on all optional fields

---

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
