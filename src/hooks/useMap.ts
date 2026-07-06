import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl, { LngLatBoundsLike, LngLatLike } from "maplibre-gl";
import { MAP_OPTIONS } from "../lib/map";
import "maplibre-gl/dist/maplibre-gl.css";

export default function useMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      ...MAP_OPTIONS,

      renderWorldCopies: false,

      cooperativeGestures: true,

      dragRotate: false,

      pitchWithRotate: false,

      maxZoom: 18,
      minZoom: 3,

      maxBounds: [
        [67.5, 6.5], // SW India
        [97.5, 37.5], // NE India
      ],
    });

    mapRef.current = map;

    const onLoad = () => {
      map.resize();

      const isMobile = window.innerWidth < 768;

      map.addControl(
        new maplibregl.NavigationControl({
          showCompass: !isMobile,
          showZoom: true,
        }),
        isMobile ? "top-right" : "bottom-right",
      );

      map.dragRotate.disable();

      try {
        map.touchZoomRotate.disableRotation();
      } catch (_) {}

      map.on("error", (e) => {
        console.error("🗺️ MapLibre Error:", e);
      });

      setMapReady(true);
    };

    map.once("load", onLoad);

    resizeObserverRef.current = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserverRef.current.observe(mapContainer.current);

    return () => {
      resizeObserverRef.current?.disconnect();

      try {
        map.remove();
      } catch (_) {}

      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  const flyTo = useCallback(
    (
      center: LngLatLike,
      zoom = 14,
      duration = 1200,
      bearing = 0,
      pitch = 0,
    ) => {
      if (!mapRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      mapRef.current.flyTo({
        center,
        zoom,
        duration,
        bearing,
        pitch,
        essential: !prefersReducedMotion,
      });
    },
    [],
  );

  const easeTo = useCallback(
    (
      center: LngLatLike,
      zoom = 14,
      duration = 800,
      bearing = 0,
      pitch = 0,
    ) => {
      if (!mapRef.current) return;

      mapRef.current.easeTo({
        center,
        zoom,
        duration,
        bearing,
        pitch,
      });
    },
    [],
  );

  const fitBounds = useCallback(
    (
      bounds: LngLatBoundsLike,
      options?: Partial<maplibregl.FitBoundsOptions>,
    ) => {
      if (!mapRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      mapRef.current.fitBounds(bounds, {
        padding: {
          top: 80,
          right: 80,
          bottom: 120,
          left: 80,
        },
        maxZoom: 15,
        duration: prefersReducedMotion ? 0 : 1200,
        ...options,
      });
    },
    [],
  );

  const getCenter = useCallback(() => {
    return mapRef.current?.getCenter();
  }, []);

  const getZoom = useCallback(() => {
    return mapRef.current?.getZoom();
  }, []);

  return {
    mapContainer,
    map: mapRef,
    mapReady,

    flyTo,
    easeTo,
    fitBounds,

    getCenter,
    getZoom,
  };
}