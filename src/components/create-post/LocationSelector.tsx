
import { useEffect, useState } from "react";
import { Check, Loader2, MapPin, Navigation } from "lucide-react";

export type Coordinates = [number, number];

interface LocationSelectorProps {
  address: string;
  coordinates: Coordinates | null;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export default function LocationSelector({
  address,
  coordinates,
  onAddressChange,
  onCoordinatesChange,
}: LocationSelectorProps) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onCoordinatesChange([
          position.coords.longitude,
          position.coords.latitude,
        ]);

        setLocating(false);
      },
      () => {
        setLocationError(
          "Unable to detect your location. You can enter it manually.",
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      },
    );
  };

  useEffect(() => {
    if (!coordinates) {
      detectLocation();
    }

    // Intentionally only run when the component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasLocation = Boolean(coordinates);

  return (
    <div>
      <div className="mb-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
          Location
          <span className="text-[#FF3F3F]">*</span>
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-600">
          Where should this help or service be available?
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <MapPin
            className="
              pointer-events-none absolute left-3 top-1/2
              h-3.5 w-3.5 -translate-y-1/2
              text-zinc-600
            "
          />

          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="e.g. Sector 62, Noida"
            className="
              w-full rounded-xl
              border border-[#252529]
              bg-[#111113]
              py-2.5 pl-9 pr-3.5
              text-sm text-zinc-100
              placeholder:text-zinc-700
              outline-none
              transition-all
              focus:border-[#FF3F3F]/50
              focus:ring-2
              focus:ring-[#FF3F3F]/5
            "
          />
        </div>

        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          title="Use my current location"
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            border border-[#252529]
            bg-[#111113]
            text-zinc-500
            transition-all
            hover:border-[#FF3F3F]/40
            hover:bg-[#151517]
            hover:text-[#FF3F3F]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </button>
      </div>

      {hasLocation && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-500">
          <Check className="h-3 w-3" />
          Location captured
        </div>
      )}

      {locationError && (
        <p className="mt-2 text-[10px] text-amber-500">{locationError}</p>
      )}
    </div>
  );
}