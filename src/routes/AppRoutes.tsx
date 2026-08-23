import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import LandingPage from "../components/LandingPage";
import CreatePost from "../components/CreatePost";
import Dashboard from "../components/Dashboard";
import Messaging from "../components/Messaging";
import ProfileView from "../components/OwnerProfileView";
import LoginPage from "../components/LoginPage";
import MyActivity from "../components/MyActivity";
import ExplorePage from "../components/ExplorePage";
import MobileHomePage from "../components/MobileHomePage";

import type { Post, User } from "../types";
import ProtectedRoute from "./ProtectedRoute";
import OwnerProfileView from "../components/OwnerProfileView";
import UserProfileView from "../components/UserProfileView";
import PublicRoutes from "./PublicRoutes";

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
      <Route
        path="/"
        element={
          <LandingPage
            onExplore={() => setActiveTab("explore")}
            onPostRequirement={onPostRequirement}
            onExplorePost={(postId) => {
              const hasPost = posts.some((p) => p.id === postId);
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
      <Route path="/explore" element={<ExplorePage />} />
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
      <Route
        path="/messaging"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Messaging />
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/activity"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyActivity onInitiateChat={() => setActiveTab("messaging")} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responses"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyActivity
              initialTab="responses"
              onInitiateChat={() => setActiveTab("messaging")}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-post"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreatePost onPostCreated={onPostCreated} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/explore" replace />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
