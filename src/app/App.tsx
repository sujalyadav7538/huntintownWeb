import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Post, User } from "@/src/shared/types";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { login, logout } from "@/src/store/authSlice";
import { socket, setSocketAuth } from "@/src/shared/lib/socket";
import { fetchPosts, clearPosts } from "@/src/store/postsSlice";
import { resetReputation } from "@/src/store/reputationSlice";
import {
  closeCreatePost,
  closeSidePanel,
  handleHideMobileBottomNav,
  handleHideUpperNavigation,
  openSidePanel,
  setSearchTerm,
} from "@/src/store/uiSlice";
import { clearPersistedState } from "@/src/store/persistence";
import { resetNotifications } from "@/src/shared/hooks/useNotifications";
import { deletePostThunk, updatePostStatusThunk } from "@/src/store/thunks";
import AppRoutes from "@/src/app/routes/AppRoutes";
import {
  getActiveTabFromPath,
  getPathFromTab,
  isProtectedTab,
} from "@/src/app/routes/tabs";

import Header from "@/src/shared/components/layout/Header";
import SidePanel from "@/src/shared/components/layout/SidePanel";
import MobileBottomNavigation from "@/src/shared/components/layout/MobileBottomNavigation";

export default function App() {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    currentUser,
    token: authToken,
  } = useAppSelector((s) => s.auth);
  const posts = useAppSelector((s) => s.posts);

  // Theme and side panel live in Redux: the theme is persisted across reloads,
  // the panel is deliberately not (see store/persistence.ts).
  const { hideMobileBottomNav, hideUpperNavigation, theme, isSidePanelOpen } =
    useAppSelector((s) => s.ui);

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

  // Reflect the persisted theme onto <html data-theme>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Load posts on first authentication — condition in thunk prevents duplicate calls
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(closeSidePanel());
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
      dispatch(closeSidePanel());
      navigate("/explore", { replace: true });
    },
    [dispatch, navigate],
  );

  const handleLogout = useCallback(() => {
    resetNotifications();
    setSocketAuth("");
    socket.disconnect();
    dispatch(clearPosts()); // reset fetch lock for next login
    dispatch(resetReputation()); // clear reputation cache for next user
    dispatch(logout());
    dispatch(closeSidePanel());
    clearPersistedState(); // drop the cached feed/chats so nothing leaks to the next user
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
    async (postId: string, status: Post["status"]) => {
      await dispatch(updatePostStatusThunk(postId, status) as any);
    },
    [dispatch],
  );

  const handleDeleteListing = useCallback(
    async (postId: string) => {
      await dispatch(deletePostThunk(postId) as any);
    },
    [dispatch],
  );

  const handleProfileUpdated = useCallback((_updated: User) => {
    // ProfileView already dispatches updateProfile after successful save.
    // Keep this callback for interface compatibility without duplicate dispatch.
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
          handleSidePanelOpen={() => dispatch(openSidePanel())}
          hideOnMobile={hideUpperNavigation}
        />

        <main
          className={`min-h-0 flex-1 w-full mx-auto ${
            hideUpperNavigation ? "pt-0 md:pt-16" : "pt-14 md:pt-16"
          } ${
            ["messaging"].includes(activeTab)
              ? "flex flex-col overflow-hidden "
              : "overflow-y-auto px-2 pb-16 sm:pb-8 lg:pb-0  sm:px-6  lg:px-4"
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

      <SidePanel
        open={isSidePanelOpen}
        onClose={() => dispatch(closeSidePanel())}
        onLogout={handleLogout}
      />
    </div>
  );
}
