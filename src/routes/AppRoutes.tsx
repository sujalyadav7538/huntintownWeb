import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import LandingPage from "../components/LandingPage";
import CreatePost from "../components/CreatePost";
import Dashboard from "../components/Dashboard";
import Messaging from "../components/Messaging";
import LoginPage from "../components/LoginPage";
import MyActivity from "../components/MyActivity";
import ExplorePage from "../components/ExplorePage";
import MobileHomePage from "../components/MobileHomePage";

import UserProfileView from "../components/UserProfileView";
import PostDetailView from "../components/explore/PostDetailView";
import ResponsesTab from "../components/activity/responses/ResponseTab";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoutes from "./PublicRoutes";

import type { Post, User } from "../types";

interface AppRoutesProps {
  isAuthenticated: boolean;
  posts: Post[];

  setActiveTab: (tab: string) => void;

  onLogin: (user: User, token: string) => void;
  onLogout: () => void;

  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;

  onUpdateStatus: (postId: string, status: Post["status"]) => void;

  onDeleteListing: (postId: string) => void;

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
        path="/mobile"
        element={<MobileHomePage setActiveTab={setActiveTab} />}
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
            <PostRoute />
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
              onInitiateChat={(postId) =>
                navigate(`/messaging?postId=${postId}`)
              }
            />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          ACTIVITY
      ========================================================== */}

      <Route
        path="/dashboard/activity"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyActivity
              initialTab="activity"
              onInitiateChat={() => setActiveTab("messaging")}
            />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          RESPONSES
      ========================================================== */}

      {/* All responses */}
      <Route
        path="/dashboard/responses/:id?"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyActivity
              initialTab="responses"
              onInitiateChat={() => setActiveTab("messaging")}
            />
          </ProtectedRoute>
        }
      />

      {/* Backward-compatible route */}
      <Route
        path="/responses"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/dashboard/responses" replace />
          </ProtectedRoute>
        }
      />

      {/* =========================================================
          SINGLE POST RESPONSES
      ========================================================== */}

      {/* Owner clicks "Explore" on My Posts */}
      <Route
        path="/dashboard/response/:postId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PostResponsesRoute />
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

      {/* =========================================================
          FALLBACK
      ========================================================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ================================================================
   POST DETAIL ROUTE
================================================================ */

function PostRoute() {
  // Replace this with your actual post-fetching logic.
  //
  // The important part is that the route is now:
  //
  // /post/:id
  //
  // and PostDetailView receives the post.

  return <PostDetailPage />;
}

/* ================================================================
   OWNER POST RESPONSE ROUTE
================================================================ */

function PostResponsesRoute() {
  return <PostResponsesPage />;
}

/* ================================================================
   PLACEHOLDER ROUTE COMPONENTS
================================================================ */

function PostDetailPage() {
  return <div className="p-6 text-zinc-400">Post detail page</div>;
}

function PostResponsesPage() {
  return <div className="p-6 text-zinc-400">Post responses</div>;
}
