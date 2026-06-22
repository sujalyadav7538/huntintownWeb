import { useState } from 'react';
import { apiFetch } from '../lib/api';
import { User } from '../types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateProfile, logout } from '../store/authSlice';
import { LogOut } from 'lucide-react';

import ProfileHero from './profile/ProfileHero';
import ProfileStats from './profile/ProfileStats';
import ProfileAbout from './profile/ProfileAbout';
import ProfileSkills from './profile/ProfileSkills';
import ProfileAchievements from './profile/ProfileAchievements';
import ProfileReviews from './profile/ProfileReviews';
import ProfileVerification from './profile/ProfileVerification';
import ProfileActivity from './profile/ProfileActivity';
import ProfileEditLayout from './profile/ProfileEditLayout';

interface ProfileViewProps {
  onUpdateProfile: (updated: User) => void;
  onLogout?: () => void;
}

export default function ProfileView({ onUpdateProfile, onLogout }: ProfileViewProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Submits the profile via multipart/form-data.
   * avatarFile is the raw File picked by the user, or null if avatar was not changed.
   * After a successful response the Cloudinary URL from the backend is used —
   * the local blob URL preview is never persisted to Redux.
   */
  const handleSave = async (updated: User, avatarFile: File | null) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const token = localStorage.getItem('access_token');

      const formData = new FormData();
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      formData.append('name', updated.name ?? '');
      formData.append('role', updated.role ?? '');
      formData.append('location', updated.location ?? '');
      formData.append('bio', updated.bio ?? '');
      formData.append('skills', JSON.stringify(updated.skills ?? []));

      // DO NOT set Content-Type — the browser sets it automatically with the
      // correct multipart boundary when body is FormData.
      const res = await apiFetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (res.status === 401) throw new Error('Session expired. Please sign in again.');
      if (res.status === 403) throw new Error('You are not authorised to update this profile.');
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as any)?.message || `Update failed (${res.status})`);
      }

      const data: { success: boolean; user: Partial<User> & { id: string } } = await res.json();

      // Merge backend user (contains Cloudinary avatar URL) over the local draft
      const persisted: User = {
        ...updated,
        ...data.user,
        // Ensure id is never lost
        id: data.user.id || updated.id,
      };

      dispatch(updateProfile(persisted));
      onUpdateProfile(persisted);
      setMode('view');
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    onLogout?.();
  };

  return (
    <div className="relative min-h-screen bg-[#0C0C0E]">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-[#FF3F3F]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
        {mode === 'edit' ? (
          <>
            {saveError && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400 text-sm">
                <span className="shrink-0">⚠</span>
                <span>{saveError}</span>
                <button
                  onClick={() => setSaveError(null)}
                  className="ml-auto text-red-500 hover:text-red-300 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <ProfileEditLayout
              user={currentUser}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={() => { setMode('view'); setSaveError(null); }}
            />
          </>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Hero */}
            <ProfileHero
              user={currentUser}
              isOwner
              onEdit={() => setMode('edit')}
            />

            {/* Body: 2-col on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left column */}
              <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">
                <ProfileAbout user={currentUser} />
                <ProfileSkills user={currentUser} />
                <ProfileAchievements user={currentUser} />
                <ProfileActivity user={currentUser} />
                <ProfileReviews user={currentUser} />
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5 min-w-0">
                <ProfileStats user={currentUser} />
                {/* <ProfileVerification user={currentUser} /> */}
              </div>
            </div>

            {/* ── Logout section ── */}
            <div className="mt-2 rounded-2xl border border-white/6 bg-white/[0.015] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Sign out of HuntInTown</p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  You'll need to sign back in to access your posts and messages.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/8
                  bg-white/[0.04] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
                  text-zinc-400 text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

