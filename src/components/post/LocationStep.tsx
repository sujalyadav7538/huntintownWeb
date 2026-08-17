import { MapPin, Navigation } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationStepProps {
  address: string;
  coordinates: Coordinates | null;
  onAddressChange: (value: string) => void;
  onCoordinatesChange: (value: Coordinates | null) => void;
}

export default function LocationStep({
  address,
  coordinates,
  onAddressChange,
  onCoordinatesChange,
}: LocationStepProps) {
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onCoordinatesChange({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (error) => {
        console.error("Unable to get location:", error);
      },
    );
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Location
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          Where is this happening?
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          Add a location so nearby people can discover your post.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF3F3F]/10 text-[#FF5555]">
            <MapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Location
            </p>

            <p className="mt-0.5 text-[9px] text-zinc-700">
              Your exact location is not required.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCurrentLocation}
            className="
              inline-flex shrink-0 items-center gap-1.5 rounded-lg
              border border-white/[0.06] bg-white/[0.025]
              px-2.5 py-1.5 text-[9px] font-semibold text-zinc-500
              transition hover:border-white/[0.12] hover:text-zinc-300
            "
          >
            <Navigation className="h-3 w-3" />
            Use current
          </button>
        </div>

        <div className="mt-4">
          <input
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Enter an area, locality, city or address"
            className="
              h-11 w-full rounded-xl border border-white/[0.06]
              bg-black/20 px-3.5 text-xs text-zinc-200
              outline-none transition placeholder:text-zinc-700
              focus:border-[#FF3F3F]/40
            "
          />
        </div>

        {coordinates && (
          <div className="mt-3 flex items-center gap-2 text-[9px] text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Location coordinates captured
          </div>
        )}
      </div>
    </section>
  );
}