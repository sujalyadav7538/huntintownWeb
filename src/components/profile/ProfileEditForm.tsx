import { User } from "../../types";
import AvatarUploader from "./AvatarUploader";

interface ProfileEditFormProps {
  name: string;
  setName: (value: string) => void;

  role: string;
  setRole: (value: string) => void;

  location: string;
  setLocation: (value: string) => void;

  bio: string;
  setBio: (value: string) => void;

  skillsString: string;
  setSkillsString: (value: string) => void;

  user: User;

  /** Blob URL used only for local preview — never persisted. */
  avatarPreview: string;
  /** Called when the user picks a new file. Parent creates the blob URL. */
  onAvatarFile: (file: File) => void;

  handleSave: () => void;
  handleDiscard: () => void;
}

export default function ProfileEditForm({
  name,
  setName,
  role,
  setRole,
  location,
  setLocation,
  bio,
  setBio,
  skillsString,
  setSkillsString,
  user,
  avatarPreview,
  onAvatarFile,
  handleSave,
  handleDiscard,
}: ProfileEditFormProps) {
  return (
    <div className="bg-[#121214] border border-[#232327] rounded-2xl p-6 flex flex-col gap-6">
      {/* Avatar — blob URL is preview-only; parent holds the real File */}
      <AvatarUploader
        avatar={avatarPreview}
        name={name}
        onChange={onAvatarFile}
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF3F3F]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2">
              Professional Title
            </label>

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Interior Designer"
              className="w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF3F3F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2">
            Location
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Noida Sector 62"
            className="w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF3F3F]"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2">
            Skills
          </label>

          <input
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF3F3F]"
          />

          <p className="text-xs text-zinc-500 mt-2">
            Separate skills using commas.
          </p>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-zinc-500 mb-2">
            About Yourself
          </label>

          <textarea
            rows={6}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            className="w-full resize-none bg-[#0b0b0c] border border-[#232327] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF3F3F]"
          />
        </div>

        <div className="flex items-center justify-end mt-4 gap-4">
          <button
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition font-bold"
            onClick={handleDiscard}
          >
            Discard
          </button>
          <button
            className="px-6 py-2.5 bg-[#f90606] hover:bg-[#E53535] text-white rounded-lg transition font-bold"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
