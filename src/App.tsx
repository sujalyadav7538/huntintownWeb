import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Post, User } from "./types";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { login, logout } from "./store/authSlice";
import { socket, setSocketAuth } from "./lib/socket";
import { fetchPosts, clearPosts } from "./store/postsSlice";
import { resetReputation } from "./store/reputationSlice";
import {
  closeCreatePost,
  handleHideMobileBottomNav,
  handleHideUpperNavigation,
  setSearchTerm,
} from "./store/uiSlice";
import { deletePostThunk, updatePostStatusThunk } from "./store/thunks";
import AppRoutes from "./routes/AppRoutes";
import {
  getActiveTabFromPath,
  getPathFromTab,
  isProtectedTab,
} from "./routes/tabs";

import Header from "./components/Header";
import SidePanel from "./components/sidepan/SidePan";
import MobileBottomNavigation from "./components/footer/MobileBottomNavigation";

type AppTheme = "dark" | "light";

const THEME_STORAGE_KEY = "huntintown-theme";

export default function App() {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    currentUser,
    token: authToken,
  } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.posts);
  const { hideMobileBottomNav, hideUpperNavigation } = useAppSelector(
    (s) => s.ui,
  );
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "dark" || stored === "light") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(
    () => getActiveTabFromPath(location.pathname),
    [location.pathname],
  );

  const setActiveTab = useCallback(
    (tab: string) => {
      if (isProtectedTab(tab) && !isAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }
      navigate(getPathFromTab(tab));
    },
    [isAuthenticated, navigate],
  );

  // Load posts on first authentication — condition in thunk prevents duplicate calls
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      setSidePanelOpen(false);
      dispatch(fetchPosts() as any);
    }
  }, [dispatch, isAuthenticated]);

  // Initialize socket connection if user is authenticated
  useEffect(() => {
    const token = authToken;
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
  }, [authToken, isAuthenticated]);

  const handleLogin = useCallback(
    (user: User, token: string) => {
      console.log("[App.handleLogin] Logging in, setting socket auth");
      setSocketAuth(token);
      console.log("[App.handleLogin] Connecting socket...");
      socket.connect();
      dispatch(login({ user, token }));
      setSidePanelOpen(false);
      navigate("/explore", { replace: true });
    },
    [dispatch, navigate],
  );

  const handleLogout = useCallback(() => {
    setSocketAuth("");
    socket.disconnect();
    dispatch(clearPosts()); // reset fetch lock for next login
    dispatch(resetReputation()); // clear reputation cache for next user
    dispatch(logout());
    setSidePanelOpen(false);
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  const guardedOpenCreatePost = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    navigate("/create-post");
  }, [isAuthenticated, navigate]);

  const handleExplorePost = useCallback(
    (postId: string) => {
      const targetPost = posts.find((p) => p.id === postId);
      dispatch(setSearchTerm(targetPost ? targetPost.title : ""));
      setActiveTab("explore");
    },
    [dispatch, posts, setActiveTab],
  );

  const handlePostCreated = useCallback(
    (postId: string) => {
      dispatch(closeCreatePost());
      navigate("/explore", { state: { openPostId: postId } });
    },
    [dispatch, navigate],
  );

  const handleUpdateStatus = useCallback(
    (postId: string, status: Post["status"]) => {
      dispatch(updatePostStatusThunk(postId, status) as any);
    },
    [dispatch],
  );

  const handleDeleteListing = useCallback(
    (postId: string) => {
      dispatch(deletePostThunk(postId) as any);
    },
    [dispatch],
  );

  const handleProfileUpdated = useCallback((_updated: User) => {
    // ProfileView already dispatches updateProfile after successful save.
    // Keep this callback for interface compatibility without duplicate dispatch.
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  // Keep mobile bottom nav state deterministic across direct route/tab operations.
  useEffect(() => {
    const isMessagingRoute = location.pathname === "/messaging";
    const hasConversationInUrl = Boolean(
      new URLSearchParams(location.search).get("conversationId"),
    );

    if (!isMessagingRoute || !hasConversationInUrl) {
      dispatch(handleHideMobileBottomNav(false));
      dispatch(handleHideUpperNavigation(false));
    }
  }, [dispatch, location.pathname, location.search]);

  return (
    <div className="fixed inset-0 flex flex-col  overflow-hidden theme-page-shell antialiased select-text text-zinc-100">
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openCreatePost={guardedOpenCreatePost}
          onLogoutSimulate={handleLogout}
          handleSidePanelOpen={() => setSidePanelOpen(true)}
          hideOnMobile={hideUpperNavigation}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main
          className={`min-h-0 flex-1 w-full mx-auto ${
            hideUpperNavigation ? "pt-0 md:pt-16" : "pt-14 md:pt-16"
          } ${
            ["messaging","create-post"].includes(activeTab)
              ? "flex flex-col overflow-hidden"
              : "overflow-y-auto p-1 pb-8 lg:pb-0  sm:px-6  lg:px-4"
          }`}
        >
          <AppRoutes
            isAuthenticated={isAuthenticated}
            posts={posts}
            setActiveTab={setActiveTab}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onPostRequirement={guardedOpenCreatePost}
            onExplorePost={handleExplorePost}
            onUpdateStatus={handleUpdateStatus}
            onDeleteListing={handleDeleteListing}
            onPostCreated={handlePostCreated}
            onUpdateProfile={handleProfileUpdated}
          />
        </main>

        {/* ── Mobile bottom nav ── */}
        {!hideMobileBottomNav && (
          <MobileBottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onCreatePost={guardedOpenCreatePost}
          />
        )}
      </div>

      {isAuthenticated && (
        <SidePanel
          open={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
