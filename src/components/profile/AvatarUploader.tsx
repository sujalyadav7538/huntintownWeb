import { Camera } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface AvatarUploaderProps {
  avatar: string;
  name?: string;
  onChange: (file: File) => void;
  size?: 'md' | 'lg';
}

export default function AvatarUploader({
  avatar,
  name = 'User',
  onChange,
  size = 'lg',
}: AvatarUploaderProps) {
  const dim = size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  return (
    <label className="group relative cursor-pointer block w-fit">
      {/* Gradient ring */}
      <div className="absolute -inset-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-70 group-hover:opacity-100 blur-[1px] transition-opacity duration-300" />
      <div className="relative p-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500">
        <img
          src={getAvatarUrl(name, avatar)}
          alt={name}
          className={`${dim} rounded-full object-cover bg-zinc-900 block`}
          onError={(e) => handleAvatarError(e, name)}
          referrerPolicy="no-referrer"
        />
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <Camera className="w-5 h-5 text-white" />
          <span className="text-[10px] font-semibold text-white/90 tracking-wide">Change</span>
        </div>
      </div>
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
  );
}