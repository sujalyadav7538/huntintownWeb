import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Post } from "../../types";

interface MapMarkerProps {
  map: maplibregl.Map | null;
  post: Post;
  onClick?: (post: Post) => void;
}

export default function MapMarker({ map, post, onClick }: MapMarkerProps) {
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Don't render marker if coordinates are missing
    const coords = post?.location?.coordinates;
    if (!coords || coords.length < 2) return;

    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center justify-center p-1 rounded-full";
    // Improve touch behavior
    wrapper.style.touchAction = "manipulation";

    const markerElement = document.createElement("div");
    markerElement.className =
      "w-4 h-4 md:w-5 md:h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer transition-transform";

    markerElement.onclick = (e) => {
      e.stopPropagation();
      onClick?.(post);
    };

    wrapper.appendChild(markerElement);

    markerRef.current = new maplibregl.Marker(wrapper)
      .setLngLat([coords[0], coords[1]]) // [longitude, latitude]
      .addTo(map);

    return () => {
      markerRef.current?.remove();
    };
  }, [map, post, onClick]);

  return null;
}
