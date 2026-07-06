import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { UserLocation } from "../../hooks/useUserLocation";

interface UserMarkerProps {
  map: maplibregl.Map | null;
  location: UserLocation | null;
}

export default function UserMarker({
  map,
  location,
}: UserMarkerProps) {
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map || !location) return;

    // Create marker only once
    if (!markerRef.current) {
      const el = document.createElement("div");

      el.className =
        "w-5 h-5 rounded-full bg-red-500 border-4 border-white shadow-lg";

      markerRef.current = new maplibregl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
    } else {
      // Move marker when location changes
      markerRef.current.setLngLat([
        location.longitude,
        location.latitude,
      ]);
    }

    return () => {
      // Cleanup only when component unmounts
      // (optional because map.remove() also clears markers)
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, location]);

  return null;
}