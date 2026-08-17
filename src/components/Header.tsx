import { useAppDispatch, useAppSelector } from "../store/hooks";
import DesktopNavigation from "./header/DesktopNavigation";

import MobileNavigation from "./header/MobileNavigation";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreatePost: () => void;
  onLogoutSimulate: () => void;
  handleSidePanelOpen: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  openCreatePost,
  onLogoutSimulate,
  handleSidePanelOpen,
}: HeaderProps) {
  const unreadMessagesCount = useAppSelector((s) =>
    s.conversations.conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-100 border-b border-[#242428] bg-[#121214]/90 backdrop-blur-xl">
      {/* Mobile */}
      <div className="md:hidden">
        <MobileNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          handleSidePanelOpen={handleSidePanelOpen}
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
        />
      </div>
    </header>
  );
}

