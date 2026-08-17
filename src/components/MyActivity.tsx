import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import ResponsesTab from "./activity/responses/ResponseTab";
import ActivityTab from "./activity/activity/ActivityTab";
import { Activity, Inbox } from "lucide-react";

type HubTab = "activity" | "responses";

interface MyActivityProps {
  onInitiateChat: () => void;
  initialTab?: HubTab;
}

export default function MyActivity({
  onInitiateChat,
  initialTab = "activity",
}: MyActivityProps) {
  const { currentUser } = useAppSelector((s) => s.auth);

  const [tab, setTab] = useState<HubTab>(initialTab);

  const currentUserId = (currentUser as any)?._id || currentUser?.id || "";

  const [isSelected, setSelected] = useState(true);

  const hideTabs = (value: boolean) => {
    setSelected(value);
  };
  return (
    <div className="mx-auto w-full max-w-7xl pt-3 lg:pt-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                My Hub
              </h1>

              <span className="rounded-full bg-[#FF3F3F]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF3F3F]">
                Hub
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-600">
              Manage your posts and track your offers.
            </p>
          </div>

          {/* Tabs */}
          {isSelected && (
            <nav className="hidden items-center gap-5 sm:flex">
              <HubTabButton
                active={tab === "activity"}
                icon={Activity}
                label="Activity"
                onClick={() => setTab("activity")}
              />

              <HubTabButton
                active={tab === "responses"}
                icon={Inbox}
                label="Responses"
                onClick={() => setTab("responses")}
              />
            </nav>
          )}
        </div>

        {/* Mobile tabs */}
        {isSelected && (
          <nav className="mt-5 flex items-center gap-5 border-b border-zinc-800/70 sm:hidden">
            <HubTabButton
              active={tab === "activity"}
              icon={Activity}
              label="Activity"
              onClick={() => setTab("activity")}
            />

            <HubTabButton
              active={tab === "responses"}
              icon={Inbox}
              label="Responses"
              onClick={() => setTab("responses")}
            />
          </nav>
        )}
      </div>

      {/* Content */}
      {tab === "responses" ? (
        <ResponsesTab
          onInitiateChat={onInitiateChat}
          currentUserId={currentUserId}
          hideTabs={hideTabs}
        />
      ) : (
        <ActivityTab onInitiateChat={onInitiateChat} hideTabs={hideTabs} />
      )}
    </div>
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
