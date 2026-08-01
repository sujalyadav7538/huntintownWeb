import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "./types";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { login, logout, updateProfile } from "./store/authSlice";
import { socket, setSocketAuth } from "./lib/socket";
import { fetchPosts } from "./store/postsSlice";
import {
  openCreatePost,
  closeCreatePost,
  setSearchTerm,
} from "./store/uiSlice";
import { deletePostThunk, updatePostStatusThunk } from "./store/thunks";

import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import CreatePost from "./components/CreatePost";
import Dashboard from "./components/Dashboard";
import Messaging from "./components/Messaging";
import ProfileView from "./components/ProfileView";
import LoginPage from "./components/LoginPage";
import MyActivity from "./components/MyActivity";
import ExplorePage from "./components/ExplorePage";

import { LayoutGrid, Plus, Home, Activity, Inbox } from "lucide-react";
import SidePanel from "./components/sidepan/SidePan";
import MobileBottomNavigation from "./components/footer/MobileBottomNavigation";
import MobileHomePage from "./components/MobileHomePage";

const PROTECTED_TABS = [
  "feed",
  "dashboard",
  "messaging",
  "profile",
  "activity",
  "responses",
] as const;

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, currentUser } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const { conversations, activeConversationId } = useAppSelector(
    (s) => s.conversations,
  );
  const { isCreatePostOpen, searchTerm } = useAppSelector((s) => s.ui);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = (() => {
    const clean = location.pathname.replace(/^\//, "");
    return clean || "landing";
  })();

  const setActiveTab = (tab: string) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    navigate(tab === "landing" ? "/" : `/${tab}`);
  };
  console.log("Google API id",import.meta.env.VITE_GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (PROTECTED_TABS.includes(activeTab) && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [activeTab, isAuthenticated]);

  const unreadMessagesCount = conversations.reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  // Load posts into Redux whenever the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setSidePanelOpen(false);
      dispatch(fetchPosts() as any);
    }
  }, [isAuthenticated]);

  // Initialize socket connection if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("[App] Socket init effect:", {
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length,
      socketConnected: socket.connected,
    });

    if (isAuthenticated && token) {
      if (!socket.connected) {
        console.log("[App] Setting socket auth and connecting...");
        setSocketAuth(token);
        socket.connect();
      } else {
        console.log("[App] Socket already connected");
      }
    } else if (!isAuthenticated && socket.connected) {
      console.log("[App] Disconnecting socket (not authenticated)");
      socket.disconnect();
    } else if (!isAuthenticated && !token) {
      console.log("[App] No token available, socket remains disconnected");
    }
  }, [isAuthenticated]);

  const handleLogin = (user: User, token: string) => {
    console.log("[App.handleLogin] Logging in, setting socket auth");
    setSocketAuth(token);
    console.log("[App.handleLogin] Connecting socket...");
    socket.connect();
    dispatch(login({ user, token }));
    setSidePanelOpen(false);
    navigate("/explore", { replace: true });
  };

  const handleLogout = () => {
    setSocketAuth("");
    socket.disconnect();
    dispatch(logout());
    setSidePanelOpen(false);
    navigate("/login", { replace: true });
  };

  const guardedOpenCreatePost = () => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    dispatch(openCreatePost());
  };

  const renderActiveView = () => {
    // Synchronous guard: never render a protected view for unauthenticated users.
    // The useEffect above handles the redirect; this prevents any render flash.
    if (PROTECTED_TABS.includes(activeTab) && !isAuthenticated) {
      return null;
    }

    switch (activeTab) {
      case "mobile":
        return <MobileHomePage setActiveTab={setActiveTab} />;
      case "landing":
        return (
          <LandingPage
            onExplore={() => setActiveTab("explore")}
            onPostRequirement={() => {
              if (!isAuthenticated) {
                navigate("/login", { replace: true });
                return;
              }
              dispatch(openCreatePost());
            }}
            onExplorePost={(postId) => {
              const tgt = posts.find((p) => p.id === postId);
              dispatch(setSearchTerm(tgt ? tgt.title : ""));
              setActiveTab("explore");
            }}
            onInitiateChat={() => setActiveTab("messaging")}
          />
        );

      case "dashboard":
        return (
          <Dashboard
            onUpdateStatus={(postId, status) =>
              dispatch(updatePostStatusThunk(postId, status) as any)
            }
            onDeleteListing={(id) => dispatch(deletePostThunk(id) as any)}
            onSelectPost={() => setActiveTab("explore")}
            setActiveTab={setActiveTab}
            onInitiateChat={(postId) => navigate(`/messaging?postId=${postId}`)}
          />
        );
      case "messaging":
        return <Messaging />;
      case "profile":
        return (
          <ProfileView
            onUpdateProfile={(updated) => dispatch(updateProfile(updated))}
            onLogout={handleLogout}
          />
        );
      case "activity":
        return <MyActivity onInitiateChat={() => setActiveTab("messaging")} />;
      case "responses":
        return (
          <MyActivity
            initialTab="responses"
            onInitiateChat={() => setActiveTab("messaging")}
          />
        );
      case "login":
        return <LoginPage onLogin={handleLogin} />;
      case "explore":
        return <ExplorePage />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-[#171717]  flex flex-col antialiased select-text text-zinc-100 overflow-x-hidden">
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreatePost={guardedOpenCreatePost}
          onLogoutSimulate={handleLogout}
          handleSidePanelOpen={() => setSidePanelOpen(true)}
        />

        <main
          className={`flex-1 w-full mx-auto ${
            activeTab === "messaging"
              ? "flex flex-col overflow-hidden"
              : "sm:px-6 lg:px-8  pb-24 md:pb-8 p-2"
          }`}
        >
          {renderActiveView()}
        </main>

        {/* ── Mobile bottom nav ── */}
        <MobileBottomNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onCreatePost={guardedOpenCreatePost}
        />
      </div>

      {isAuthenticated && (
        <SidePanel
          open={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {isCreatePostOpen && (
        <CreatePost
          onClose={() => dispatch(closeCreatePost())}
          onPostCreated={(postId) => {
            dispatch(closeCreatePost());
            navigate("/explore", { state: { openPostId: postId } });
          }}
        />
      )}
    </div>
  );
}
