import { ReactNode, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Activity, Clock3, Inbox } from "lucide-react";

import { useAppSelector } from "@/src/store/hooks";
import { useIsTablet } from "@/src/shared/hooks/useBreakpoint";
import { useSeo } from "@/src/shared/hooks/useSeo";
import ResponsesTab from "@/src/features/activity/components/responses/ResponseTab";
import ActivityTab from "@/src/features/activity/components/activity/ActivityTab";

type HubTab = "activity" | "responses";

const TAB_PATHS: Record<HubTab, string> = {
  activity: "/activity",
  responses: "/responses",
};

interface MyActivityProps {
  onInitiateChat: () => void;
  initialTab?: HubTab;
}

export default function MyActivityPage({
  onInitiateChat,
  initialTab = "activity",
}: MyActivityProps) {
  const { currentUser } = useAppSelector((s) => s.auth);

  const location = useLocation();
  const navigate = useNavigate();
  const isTablet = useIsTablet();

  const [showTabs, setShowTabs] = useState(true);

  /*
   * The URL is the single source of truth for the active tab:
   * /activity  -> Activity
   * /responses -> Responses
   *
   * initialTab is only the fallback for any other mount point.
   */
  const tab: HubTab =
    location.pathname === TAB_PATHS.responses
      ? "responses"
      : location.pathname === TAB_PATHS.activity
        ? "activity"
        : initialTab;

  const setTab = useCallback(
    (next: HubTab) => {
      if (next === tab) return;
      navigate(TAB_PATHS[next]);
    },
    [navigate, tab],
  );

  useSeo({ title: tab === "responses" ? "Responses" : "My Activity" });

  const currentUserId = currentUser?.id || currentUser?._id || "";

  // A tab hides the switcher while it has a detail view open.
  const hideTabs = (value: boolean) => setShowTabs(value);

  const content: ReactNode =
    tab === "responses" ? (
      <ResponsesTab
        onInitiateChat={onInitiateChat}
        currentUserId={currentUserId}
        hideTabs={hideTabs}
      />
    ) : (
      <ActivityTab onInitiateChat={onInitiateChat} hideTabs={hideTabs} />
    );

  const viewProps: HubViewProps = {
    tab,
    showTabs,
    onTabChange: setTab,
    children: content,
  };

  return isTablet ? (
    <MyActivityDesktop {...viewProps} />
  ) : (
    <MyActivityMobile {...viewProps} />
  );
}

interface HubViewProps {
  tab: HubTab;
  showTabs: boolean;
  onTabChange: (tab: HubTab) => void;
  children: ReactNode;
}

/* ================================================================
   DESKTOP — title and tabs share one row
================================================================ */

function MyActivityDesktop({
  tab,
  showTabs,
  onTabChange,
  children,
}: HubViewProps) {
  return (
    <div className="theme-page-shell mx-auto w-full max-w-7xl pt-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <HubTitle />

        {showTabs && (
          <nav className="flex items-center gap-5">
            <HubTabs tab={tab} onTabChange={onTabChange} />
          </nav>
        )}
      </div>

      {children}
    </div>
  );
}

/* ================================================================
   MOBILE — tabs drop to a full-width underlined bar
================================================================ */

function MyActivityMobile({
  tab,
  showTabs,
  onTabChange,
  children,
}: HubViewProps) {
  return (
    <div className="theme-page-shell mx-auto w-full pt-3">
      <div className="mb-5">
        <HubTitle />

        {showTabs && (
          <nav className="theme-divider mt-4 flex items-center gap-4 border-b border-zinc-800/70 pb-1">
            <HubTabs tab={tab} onTabChange={onTabChange} />
          </nav>
        )}
      </div>

      {children}
    </div>
  );
}

/* ================================================================
   SHARED PIECES
================================================================ */

function HubTitle() {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-white">My Hub</h1>

        <span className="rounded-full bg-[#FF3F3F]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF3F3F]">
          Hub
        </span>
      </div>

      <p className="mt-1 text-xs text-zinc-600">
        Manage your posts and track your offers.
      </p>
    </div>
  );
}

function HubTabs({
  tab,
  onTabChange,
}: {
  tab: HubTab;
  onTabChange: (tab: HubTab) => void;
}) {
  return (
    <>
      <HubTabButton
        active={tab === "activity"}
        icon={Clock3}
        label="Activity"
        onClick={() => onTabChange("activity")}
      />

      <HubTabButton
        active={tab === "responses"}
        icon={Inbox}
        label="Responses"
        onClick={() => onTabChange("responses")}
      />
    </>
  );
}

function HubTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Activity;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        rounded-lg px-3 py-1.5
        text-[11px] font-semibold
        transition-all
        ${
          active
            ? "bg-[#FF3F3F] text-white shadow-sm shadow-[#FF3F3F]/20"
            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
        }
      `}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
