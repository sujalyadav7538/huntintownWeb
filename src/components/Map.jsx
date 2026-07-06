import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [77.209, 28.6139], // Delhi
      zoom: 12,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl());

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[500px] rounded-xl"
    />
  );
}