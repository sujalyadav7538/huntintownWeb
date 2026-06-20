import { Camera } from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";

interface AvatarUploaderProps {
  avatar: string;
  onChange: (file: File) => void;
}

export default function AvatarUploader({
  avatar,
  onChange,
}: AvatarUploaderProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={getAvatarUrl('User', avatar)}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-zinc-800"
          onError={(e) => handleAvatarError(e, 'User')}
          referrerPolicy="no-referrer"
        />

        <label className="absolute bottom-1 right-1 bg-[#FF3F3F] p-2 rounded-full cursor-pointer">
          <Camera className="w-4 h-4 text-white" />

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}