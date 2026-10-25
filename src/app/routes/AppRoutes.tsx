import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import LandingPage from "@/src/features/home/pages/LandingPage";
import CreatePost from "@/src/features/posts/pages/CreatePostPage";
import Dashboard from "@/src/features/dashboard/pages/DashboardPage";
import Messaging from "@/src/features/messaging/pages/MessagingPage";
import LoginPage from "@/src/features/auth/pages/LoginPage";
import ExplorePage from "@/src/features/explore/pages/ExplorePage";

import UserProfileView from "@/src/features/profile/pages/UserProfilePage";
import PostDetailView from "@/src/features/explore/components/PostDetailView";

import ProtectedRoute from "@/src/app/routes/ProtectedRoute";
import PublicRoutes from "@/src/app/routes/PublicRoutes";

import type { Post, User } from "@/src/shared/types";
import AboutPage from "@/src/features/home/pages/AboutPage";
import HelpCenterPage from "@/src/features/home/pages/HelpCenterPage";
import ContactPage from "@/src/features/home/pages/ContactPage";
import NotificationsPage from "@/src/features/notifications/pages/NotificationsPage";
import TermsAndConditionsPage from "@/src/features/auth/pages/TermsAndConditionsPage";
import { apiFetchJSON } from "@/src/shared/lib/api";
import { normalizePost } from "@/src/store/postsSlice";
import { useSeo } from "@/src/shared/hooks/useSeo";
import useRouteBack from "@/src/shared/hooks/useRouteBack";
import { absoluteUrl } from "@/src/shared/lib/seo";

interface AppRoutesProps {
  isAuthenticated: boolean;

  setActiveTab: (tab: string) => void;

  onLogin: (user: User, token: string) => void;
  onLogout: () => void;

  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;

  onUpdateStatus: (
    postId: string,
    status: Post["status"],
  ) => void | Promise<void>;

  onDeleteListing: (postId: string) => void | Promise<void>;

  onPostCreated: (postId: string) => void;

  onUpdateProfile: (updated: User) => void;
}

export default function AppRoutes({
  isAuthenticated,
  setActiveTab,
  onLogin,
  onLogout,
  onPostRequirement,
  onExplorePost,
  onUpdateStatus,
  onDeleteListing,
  onPostCreated,
  onUpdateProfile,
}: AppRoutesProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* =========================================================
          PUBLIC
      ========================================================== */}

      <Route
        path="/"
        element={
          <LandingPage
            onExplore={() => setActiveTab("explore")}
            onPostRequirement={onPostRequirement}
            onExplorePost={(postId) => {
              onExplorePost(postId);
            }}
            onInitiateChat={() => setActiveTab("messaging")}
          />
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoutes isAuthenticated={isAuthenticated}>
            <LoginPage onLogin={onLogin} />
          </PublicRoutes>
        }
      />
      {/* =========================================================
          EXPLORE
      ========================================================== */}

      {/* Main explore page */}
      <Route path="/explore" element={<ExplorePage />} />

      {/* User's posts from Explore / profile */}
      <Route path="/explore/:userId" element={<ExplorePage />} />

      {/* =========================================================
          POSTS
      ========================================================== */}

      {/* Public/other-user post detail */}
      <Route
        path="/post/:id"
        element={<PostDetailRoute />}
      />
      <Route
        path="/post/:id/apply"
        element={<PostApplicationRedirect />}
      />

      {/* =========================================================
          DASHBOARD
      ========================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard
              onUpdateStatus={onUpdateStatus}
              onDeleteListing={onDeleteListing}
              onSelectPost={() => setActiveTab("explore")}
              setActiveTab={setActiveTab}
              onInitiateChat={(postId, conversationId, chatMode) => {
                const params = new URLSearchParams({ postId });
                if (conversationId)
                  params.set("conversationId", conversationId);
                if (chatMode) params.set("chatMode", chatMode);
                navigate(`/messaging?${params.toString()}`);
              }}
            />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          ACTIVITY
      ========================================================== */}

      <Route
        path="/activity"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/dashboard?view=submitted" replace />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          RESPONSES
      ========================================================== */}

      {/* All responses */}
      <Route
        path="/responses"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          SINGLE POST RESPONSES
      ========================================================== */}

      {/* Owner clicks "Explore" on My Posts */}
      <Route
        path="/response/:postId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PostResponsesRedirect />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          PROFILE
      ========================================================== */}

      <Route
        path="/profile/:id?"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserProfileView
              onUpdateProfile={onUpdateProfile}
              onLogout={onLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          CREATE POST
      ========================================================== */}

      <Route
        path="/create-post"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreatePost onPostCreated={onPostCreated} />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          MESSAGING
      ========================================================== */}

      <Route
        path="/messaging"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Messaging />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          NOTIFICATIONS
      ========================================================== */}

      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          LEGACY
      ========================================================== */}

      <Route
        path="/feed"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/explore" replace />
          </ProtectedRoute>
        }
      />

      {/* About Page */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpCenterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/legal" element={<LegalPage />} />

      {/* =========================================================
          FALLBACK
      ========================================================== */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function LegalPage() {
  const location = useLocation();

  useSeo({
    title: "Terms & Privacy",
    description:
      "Read the HuntInTown Terms & Conditions and Privacy Policy, including how the platform handles accounts, user content, safety, and personal information.",
    path: "/legal",
  });

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
  }, [location.hash]);

  return <TermsAndConditionsPage mode="page" />;
}

function NotFoundPage() {
  useSeo({
    title: "Page Not Found",
    description: "The page you requested could not be found on HuntInTown.",
    noIndex: true,
  });

  return (
    <main className="theme-page-shell flex min-h-[60vh] flex-col items-center justify-center px-5 py-16 text-center">
      <p className="landing-eyebrow text-sm font-semibold uppercase">404</p>
      <h1 className="theme-text-primary mt-3 text-3xl font-bold">
        Page not found
      </h1>
      <p className="theme-text-muted mt-3 max-w-md text-sm leading-6">
        This link may be outdated, or the page may have moved. Explore local
        requirements or return to the HuntInTown homepage.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/explore"
          className="theme-btn-accent rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Browse requirements
        </Link>
        <Link
          to="/"
          className="landing-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

/* ================================================================
   POST DETAIL ROUTE — /post/:id

   Loads a single post by id so the view is deep-linkable (used after
   publishing a requirement and from "Recent posts" on a profile).
================================================================ */

function PostResponsesRedirect() {
  const { postId } = useParams<{ postId: string }>();
  return (
    <Navigate
      to={`/dashboard?postId=${encodeURIComponent(postId ?? "")}`}
      replace
    />
  );
}

function PostApplicationRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/post/${encodeURIComponent(id ?? "")}`} replace />;
}

function PostDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const routeBack = useRouteBack("/explore");
  const goBack = () => {
    if (location.state?.returnTo === "/explore") {
      navigate("/explore", { replace: true });
      return;
    }
    routeBack();
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    setPost(null);
    setError(null);

    apiFetchJSON<{ success: boolean; post: unknown }>(`/api/posts/${id}`)
      .then((data) => {
        if (!cancelled) setPost(normalizePost(data.post));
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Could not load this post");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // A requirement is the one piece of user-generated content worth indexing,
  // so it gets a real title, description, share image and schema.org entity.
  useSeo({
    title: post?.title,
    description: post?.description,
    path: id ? `/post/${id}` : undefined,
    type: "article",
    noIndex: !post || Boolean(error),
    image: post?.images?.[0],
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Demand",
          name: post.title,
          url: absoluteUrl(`/post/${id}`),
          image: post.images?.map(absoluteUrl),
          description: post.description,
          category: post.category,
          availabilityStarts: post.createdAt,
          availabilityEnds: post.expiresAt,
          areaServed: post.address,
          seller: post.author?.name
            ? { "@type": "Person", name: post.author.name }
            : undefined,
        }
      : null,
  });

  if (error) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <p className="text-sm font-semibold text-zinc-300">
          Couldn't load this post
        </p>

        <p className="mt-1.5 text-[11px] text-zinc-600">{error}</p>

        <button
          type="button"
          onClick={goBack}
          className="mt-4 rounded-full bg-[#FF3F3F] px-4 py-2 text-[10px] font-bold text-white transition hover:bg-[#e53535]"
        >
          Back to explore
        </button>
      </div>
    );
  }

  if (!post) {
    return <div className="p-6 text-xs text-zinc-500">Loading post…</div>;
  }

  return (
    <PostDetailView
      key={post.id}
      post={post}
      onBack={goBack}
      onViewProfile={(author) =>
        navigate(`/profile/${author.id ?? author._id}`)
      }
    />
  );
}
