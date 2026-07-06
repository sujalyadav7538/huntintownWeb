import { useEffect, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { Post } from "../../../types";

interface PostsLayerProps {
  map: maplibregl.Map | null;
  posts: Post[];
  onPostClick?: (post: Post) => void;
}

export default function PostsLayer({
  map,
  posts,
  onPostClick,
}: PostsLayerProps) {
  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: posts
        .filter(
          (p) =>
            p.location?.coordinates &&
            p.location.coordinates.length === 2 &&
            typeof p.location.coordinates[0] === "number" &&
            typeof p.location.coordinates[1] === "number",
        )
        .map((post) => ({
          type: "Feature" as const,
          properties: {
            id: post._id || post.id,
            title: post.title,
          },
          geometry: {
            type: "Point" as const,
            coordinates: post.location.coordinates,
          },
        })),
    }),
    [posts],
  );

  // Create source + layers only once
  useEffect(() => {
    if (!map) return;

    const initialize = () => {
      if (map.getSource("posts")) return;

      map.addSource("posts", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 18,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "posts",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#ef4444",
            20,
            "#dc2626",
            50,
            "#b91c1c",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 20, 26, 50, 34],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "posts",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
      });

      map.addLayer({
        id: "posts-layer",
        type: "circle",
        source: "posts",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 7,
          "circle-color": "#ef4444",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    };

    if (map.isStyleLoaded()) {
      initialize();
    } else {
      map.once("load", initialize);
    }

    return () => {
      map.off("load", initialize);
    };
  }, [map]);

  // Update source whenever posts change
  useEffect(() => {
    if (!map) return;

    const source = map.getSource("posts") as
      | maplibregl.GeoJSONSource
      | undefined;

    if (!source) return;

    source.setData(geojson as any);
  }, [map, geojson]);

  // Register events once
  useEffect(() => {
    if (!map) return;

    const handlePostClick = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const id = feature.properties?.id;

      const post = posts.find((p) => (p._id || p.id) === id);

      if (post) {
        onPostClick?.(post);
      }
    };

    const handleClusterClick = async (e: maplibregl.MapLayerMouseEvent) => {
      const feature = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      })[0];

      if (!feature) return;

      const clusterId = feature.properties?.cluster_id;

      const source = map.getSource("posts") as maplibregl.GeoJSONSource;

      try {
        const zoom = await source.getClusterExpansionZoom(clusterId);

        map.easeTo({
          center: (feature.geometry as any).coordinates,
          zoom,
          duration: 500,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "posts-layer", handlePostClick);
    map.on("click", "clusters", handleClusterClick);

    map.on("mouseenter", "clusters", handleMouseEnter);
    map.on("mouseleave", "clusters", handleMouseLeave);

    map.on("mouseenter", "posts-layer", handleMouseEnter);
    map.on("mouseleave", "posts-layer", handleMouseLeave);

    return () => {
      map.off("click", "posts-layer", handlePostClick);
      map.off("click", "clusters", handleClusterClick);

      map.off("mouseenter", "clusters", handleMouseEnter);
      map.off("mouseleave", "clusters", handleMouseLeave);

      map.off("mouseenter", "posts-layer", handleMouseEnter);
      map.off("mouseleave", "posts-layer", handleMouseLeave);
    };
  }, [map, posts, onPostClick]);

  return null;
}
