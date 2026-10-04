import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useIsTablet } from "@/src/shared/hooks/useBreakpoint";
import { toggleTheme } from "@/src/store/uiSlice";

import DesktopNavigation from "@/src/shared/components/layout/header/DesktopNavigation";
import MobileNavigation from "@/src/shared/components/layout/header/MobileNavigation";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreatePost: () => void;
  onLogoutSimulate: () => void;
  handleSidePanelOpen: () => void;
  hideOnMobile?: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  openCreatePost,
  onLogoutSimulate,
  handleSidePanelOpen,
  hideOnMobile = false,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const isTablet = useIsTablet();

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const theme = useAppSelector((s) => s.ui.theme);

  const unreadMessagesCount = useAppSelector((s) =>
    s.conversations.conversations.reduce(
      (sum, c) => sum + (c.unreadCount ?? 0),
      0,
    ),
  );

  const onToggleTheme = () => dispatch(toggleTheme());

  // The mobile header collapses to nothing on screens that hide it.
  if (!isTablet && hideOnMobile) {
    return <header className="fixed top-0 right-0 left-0 z-100 h-0" />;
  }

  return (
    <header
      className={`theme-header fixed top-0 right-0 left-0 z-100 pt-2 backdrop-blur-xl ${
        isTablet
          ? "h-16 border-b border-[#242428]"
          : "h-14 border-b border-[#242428]"
      }`}
    >
      {isTablet ? (
        <DesktopNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          isAuthenticated={isAuthenticated}
          openCreatePost={openCreatePost}
          onLogoutSimulate={onLogoutSimulate}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      ) : (
        <MobileNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          handleSidePanelOpen={handleSidePanelOpen}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      )}
    </header>
  );
}
