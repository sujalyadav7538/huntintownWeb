import { useAppDispatch, useAppSelector } from "../store/hooks";
import DesktopNavigation from "./header/DesktopNavigation";

import MobileNavigation from "./header/MobileNavigation";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreatePost: () => void;
  onLogoutSimulate: () => void;
  handleSidePanelOpen: () => void;
  hideOnMobile?: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  openCreatePost,
  onLogoutSimulate,
  handleSidePanelOpen,
  hideOnMobile = false,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const unreadMessagesCount = useAppSelector((s) =>
    s.conversations.conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  );

  return (
    <header
      className={`fixed top-0 left-0 pt-2 right-0 z-100 backdrop-blur-xl md:h-16 md:border-b md:border-[#242428] ${
        hideOnMobile ? "h-0 border-b-0" : "h-14 border-b border-[#242428]"
      }`}
    >
      {/* Mobile */}
      <div className={`md:hidden ${hideOnMobile ? "hidden" : "block"}`}>
        <MobileNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          handleSidePanelOpen={handleSidePanelOpen}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          isAuthenticated={useAppSelector((s) => s.auth.isAuthenticated)}
          openCreatePost={openCreatePost}
          onLogoutSimulate={onLogoutSimulate}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </div>
    </header>
  );
}
