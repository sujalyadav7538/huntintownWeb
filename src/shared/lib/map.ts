import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const DEFAULT_CENTER: [number, number] = [
  77.209,
  28.6139,
];

export const DEFAULT_ZOOM = 12;

export const MAP_STYLE =
  "https://tiles.openfreemap.org/styles/liberty";

export const INDIA_BOUNDS = new maplibregl.LngLatBounds(
  [68.176645, 6.554607],
  [97.402561, 35.674545],
);

export const MAP_OPTIONS: Omit<maplibregl.MapOptions, "container"> = {
  style: MAP_STYLE,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  minZoom: 3,
  maxZoom: 20,
  maxBounds: INDIA_BOUNDS,
  attributionControl: false,
};