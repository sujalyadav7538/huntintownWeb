import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

export default function useVisibleBounds(
  map: React.MutableRefObject<maplibregl.Map | null>,
) {
  const [bounds, setBounds] = useState<maplibregl.LngLatBounds | null>(null);

  useEffect(() => {
    if (!map.current) return;

    const updateBounds = () => {
      setBounds(map.current!.getBounds());
    };

    updateBounds();

    map.current.on("moveend", updateBounds);
    map.current.on("zoomend", updateBounds);

    return () => {
      map.current?.off("moveend", updateBounds);
      map.current?.off("zoomend", updateBounds);
    };
  }, [map]);

  return bounds;
}
