import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import LandingPage from "@/src/features/home/pages/LandingPage";
import CreatePost from "@/src/features/posts/pages/CreatePostPage";
import Dashboard from "@/src/features/dashboard/pages/DashboardPage";
import Messaging from "@/src/features/messaging/pages/MessagingPage";
import LoginPage from "@/src/features/auth/pages/LoginPage";
import ExplorePage from "@/src/features/explore/pages/ExplorePage";
import MobileHomePage from "@/src/features/home/pages/MobileHomePage";

import UserProfileView from "@/src/features/profile/pages/UserProfilePage";
import PostDetailView from "@/src/features/explore/components/PostDetailView";

import ProtectedRoute from "@/src/app/routes/ProtectedRoute";
import PublicRoutes from "@/src/app/routes/PublicRoutes";

import type { Post, User } from "@/src/shared/types";
import AboutPage from "@/src/features/home/pages/AboutPage";
import NotificationsPage from "@/src/features/notifications/pages/NotificationsPage";
import { apiFetchJSON } from "@/src/shared/lib/api";
import { normalizePost } from "@/src/store/postsSlice";
import { useSeo } from "@/src/shared/hooks/useSeo";

interface AppRoutesProps {
  isAuthenticated: boolean;
  posts: Post[];

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
  posts,
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
              const hasPost = posts.some((post) => post.id === postId);

              if (!hasPost) {
                setActiveTab("explore");
                return;
              }

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
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PostDetailRoute />
          </ProtectedRoute>
        }
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
              onInitiateChat={(postId, conversationId) => {
                const params = new URLSearchParams({ postId });
                if (conversationId)
                  params.set("conversationId", conversationId);
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
            <Navigate to="/dashboard" replace />
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

      {/* =========================================================
          FALLBACK
      ========================================================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ================================================================
   POST DETAIL ROUTE — /post/:id

   Loads a single post by id so the view is deep-linkable (used after
   publishing a requirement and from "Recent posts" on a profile).
================================================================ */

function PostDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const goBack = () => navigate("/explore");

  // A requirement is the one piece of user-generated content worth indexing,
  // so it gets a real title, description, share image and schema.org entity.
  useSeo({
    title: post?.title,
    description: post?.description,
    path: id ? `/post/${id}` : undefined,
    type: "article",
    image: post?.images?.[0],
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Demand",
          name: post.title,
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
      post={post}
      onBack={goBack}
      onViewProfile={() =>
        navigate(`/profile/${post.author?.id ?? post.author?._id}`)
      }
      onResponseSubmit={goBack}
    />
  );
}
