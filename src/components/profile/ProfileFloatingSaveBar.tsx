import { Save, RotateCcw, AlertCircle } from 'lucide-react';

interface ProfileFloatingSaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  completionPct: number;
  onSave: () => void;
  onDiscard: () => void;
}

export default function ProfileFloatingSaveBar({
  isDirty,
  isSaving,
  completionPct,
  onSave,
  onDiscard,
}: ProfileFloatingSaveBarProps) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-all duration-300 ease-in-out
        ${isDirty ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`}
    >
      {/* Gradient fade above bar */}
      <div className="h-10 bg-linear-to-t from-[#0C0C0E] to-transparent pointer-events-none" />

      <div className="bg-[#0C0C0E]/95 backdrop-blur-xl border-t border-white/7 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Unsaved indicator */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] shrink-0 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400 truncate">Unsaved changes</span>
          </div>

          {/* Completion progress (desktop) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span className="text-xs text-zinc-500">Profile</span>
            <div className="w-28 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#FF3F3F] to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#FF3F3F]">{completionPct}%</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              onClick={onDiscard}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400
                hover:text-white bg-white/4 hover:bg-white/8 border border-white/7
                transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white
                bg-linear-to-r from-[#FF3F3F] to-rose-500 hover:from-rose-500 hover:to-[#FF3F3F]
                shadow-[0_2px_16px_rgba(255,63,63,0.4)] hover:shadow-[0_2px_20px_rgba(255,63,63,0.6)]
                transition-all disabled:opacity-60 active:scale-95"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
