import { Check, Crosshair, Info, LoaderCircle, MapPin, X } from "lucide-react";
import { useState } from "react";
import { FormSection } from "@/src/features/posts/components/FormSection";

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
  const [geoError, setGeoError] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Your browser doesn't support location access.");
      return;
    }

    setDetecting(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onCoordinatesChange([longitude, latitude]);
        setDetecting(false);
      },
      (error) => {
        setDetecting(false);
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Type an address instead."
            : "We couldn't detect your location. Type an address instead.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-4">
      <FormSection
        icon={Crosshair}
        title="Use your current location"
        hint="Most accurate way to reach helpers nearby."
      >
        {coordinates ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="theme-text-primary block text-sm font-semibold">
                  Location captured
                </span>
                <span className="theme-text-muted block truncate text-[11px]">
                  {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={() => onCoordinatesChange(null)}
              aria-label="Remove current location"
              className="theme-icon-muted theme-hover-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={detectLocation}
            disabled={detecting}
            className="theme-btn-accent-soft inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition disabled:opacity-60"
          >
            {detecting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Crosshair className="h-4 w-4" />
            )}
            {detecting ? "Detecting location…" : "Use my location"}
          </button>
        )}

        {geoError && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {geoError}
          </p>
        )}
      </FormSection>

      <div className="theme-text-muted flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider">
        <span className="theme-divider h-px flex-1 border-t" />
        and / or
        <span className="theme-divider h-px flex-1 border-t" />
      </div>

      <FormSection
        icon={MapPin}
        title="Area or address"
        hint={
          coordinates
            ? "Optional — a readable area name is filled in automatically if you leave this empty."
            : "Neighbourhood, landmark or street, e.g. Sector 62, Noida."
        }
      >
        <div className="relative">
          <MapPin className="theme-icon-muted pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            aria-label="Area or address"
            placeholder="e.g. Akshardham, Delhi"
            className="theme-input h-11 w-full rounded-lg border pl-10 pr-10 text-sm outline-none transition"
          />
          {address && (
            <button
              type="button"
              onClick={() => onAddressChange("")}
              aria-label="Clear address"
              className="theme-icon-muted absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full hover:text-[#FF3F3F]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </FormSection>

      <p className="theme-card-subtle theme-text-muted flex items-start gap-2 rounded-lg border px-3.5 py-3 text-xs leading-5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Only the area name is shown on your post. Exact coordinates are used to
        match you with nearby helpers.
      </p>
    </div>
  );
}
