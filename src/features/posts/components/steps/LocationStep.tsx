import { Check, Crosshair, MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";

interface LocationStepProps {
  address: string;
  coordinates: [number, number] | null;
  onAddressChange: (value: string) => void;
  onCoordinatesChange: (value: [number, number] | null) => void;
}

export default function LocationStep({
  address,
  coordinates,
  onAddressChange,
  onCoordinatesChange,
}: LocationStepProps) {
  const [detecting, setDetecting] = useState(false);
  const [locationSelected, setLocationSelected] = useState(
    !!coordinates || !!address,
  );

  const detectLocation = () => {
    if (!navigator.geolocation) return;

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        onCoordinatesChange([longitude, latitude]);
        setLocationSelected(true);
        setDetecting(false);

        // Don't automatically put coordinates into address.
        // Address can later be reverse-geocoded from backend/map.
      },
      () => {
        setDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const clearLocation = () => {
    onAddressChange("");
    onCoordinatesChange(null);
    setLocationSelected(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF3F3F]/10">
            <MapPin className="h-4 w-4 text-[#FF3F3F]" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              Where is it?
            </p>

            <p className="mt-0.5 text-[10px] text-zinc-700">
              Help nearby people find your request.
            </p>
          </div>
        </div>
      </div>

      {/* Location methods */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Current location */}
        <button
          type="button"
          onClick={detectLocation}
          disabled={detecting}
          className={`
            group flex items-center gap-3 rounded-xl border p-4
            text-left transition-all
            ${
              coordinates
                ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                : "border-white/[0.07] bg-[#111317] hover:border-white/[0.13]"
            }
          `}
        >
          <div
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              ${coordinates ? "bg-emerald-400/10" : "bg-blue-400/10"}
            `}
          >
            {coordinates ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Crosshair className="h-4 w-4 text-blue-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-zinc-200">
              {detecting
                ? "Detecting location..."
                : coordinates
                  ? "Location selected"
                  : "Use my location"}
            </p>

            <p className="mt-1 text-[9px] leading-4 text-zinc-600">
              {coordinates
                ? "Your location will be used for this request"
                : "Automatically use your current location"}
            </p>
          </div>
        </button>

        {/* Map */}
        <button
          type="button"
          className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#111317] p-4 text-left transition-all hover:border-white/[0.13]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
            <Navigation className="h-4 w-4 text-violet-400" />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-zinc-200">
              Pick on map
            </p>

            <p className="mt-1 text-[9px] leading-4 text-zinc-600">
              Choose an exact location
            </p>
          </div>
        </button>
      </div>

      {/* Address */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Address
              <span className="ml-1.5 font-normal normal-case tracking-normal text-zinc-700">
                Optional
              </span>
            </p>
          </div>

          {address && (
            <button
              type="button"
              onClick={clearLocation}
              className="text-[9px] text-zinc-600 hover:text-zinc-400"
            >
              Clear
            </button>
          )}
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-700" />

          <input
            value={address}
            onChange={(e) => {
              onAddressChange(e.target.value);
              setLocationSelected(true);
            }}
            placeholder="e.g. Akshardham, Delhi"
            className="
              h-11 w-full rounded-xl
              border border-white/[0.07]
              bg-[#111317]
              pl-9 pr-3
              text-[11px] text-zinc-200
              outline-none
              transition
              placeholder:text-zinc-700
              focus:border-[#FF3F3F]/40
            "
          />
        </div>
      </div>

      {/* Location preview */}
      {locationSelected && (
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f1216]">
          {/* Fake map preview */}
          <div className="relative h-36 overflow-hidden bg-[#11161b]">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[10%] top-1/3 h-px w-[80%] rotate-12 bg-zinc-500" />
              <div className="absolute left-[20%] top-2/3 h-px w-[70%] -rotate-6 bg-zinc-500" />
              <div className="absolute left-1/3 top-0 h-full w-px rotate-12 bg-zinc-600" />
              <div className="absolute right-1/4 top-0 h-full w-px -rotate-[20deg] bg-zinc-600" />
            </div>

            {/* Pin */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF3F3F]/30 bg-[#FF3F3F]/15 shadow-[0_0_25px_rgba(255,63,63,0.2)]">
                <MapPin className="h-4 w-4 text-[#FF3F3F]" />
              </div>

              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF3F3F]" />
            </div>

            {/* Search button */}
            <button
              type="button"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-black/40 text-zinc-400 backdrop-blur hover:text-white"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

              <p className="truncate text-[9px] text-zinc-500">
                {address || "Location selected"}
              </p>
            </div>

            <span className="shrink-0 text-[8px] font-medium text-emerald-400">
              Selected
            </span>
          </div>
        </div>
      )}

      {/* Skip */}
      {!locationSelected && (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/[0.06] px-4 py-3">
          <p className="text-[9px] text-zinc-700">
            No location? That's okay — you can skip this step.
          </p>
        </div>
      )}

      {/* Privacy */}
      <div className="flex items-start gap-2 rounded-xl bg-white/[0.018] px-3 py-2.5">
        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-zinc-700" />

        <p className="text-[9px] leading-4 text-zinc-700">
          Your exact location doesn't have to be displayed publicly. We can use
          it to connect you with people nearby.
        </p>
      </div>
    </div>
  );
}
