import { useEffect, useState } from "react";
import useMap from "../../hooks/useMap";
import useUserLocation from "../../hooks/useUserLocation";
import UserMarker from "./UserMarker";
import { Post } from "../../types";
import PostsLayer from "./layers/PostsLayer";
import { useNavigate } from "react-router-dom";
import MapPostPreview from "./MapPostPreview";
import { useAppSelector } from "@/src/store/hooks";
import maplibregl from "maplibre-gl";

interface HuntMapProps {
  posts?: Post[];
  onPostClick?: (post: Post) => void;
  className?: string;
}

export default function HuntMap({
  posts = [],
  onPostClick,
  className,
}: HuntMapProps) {
  const { mapContainer, map, mapReady } = useMap();
  const { location } = useUserLocation();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  // Fly to user's location once the map is ready and location is available
  useEffect(() => {
    console.log("njinji", mapReady, map.current);
    // if (!mapReady || !map.current ) return;
    // 1. Browser GPS
    if (location) {
      console.log("Rendering GPS location");
      map.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 14,
        duration: 1500,
      });
      return;
    }
    const userCoordinates = currentUser?.location?.coordinates;
    // 2. Saved profile location
    if (userCoordinates) {
      console.log("Rendering User location");
      map.current.flyTo({
        center: [userCoordinates.longitude, userCoordinates.latitude],
        zoom: 14,
        duration: 1500,
      });
      return;
    }
    // 3. Focus all available posts
    const bounds = new maplibregl.LngLatBounds();

    let hasPosts = false;

    posts.forEach((post) => {
      const coords = post.location?.coordinates;

      if (
        coords &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      ) {
        bounds.extend(coords);
        hasPosts = true;
      }
    });
    console.log(bounds);
    if (hasPosts) {
      console.log("Rendering Cluster location");
      map.current.fitBounds(bounds, {
        padding: {
          top: 80,
          bottom: 120,
          left: 80,
          right: 80,
        },
        maxZoom: 14,
        duration: 1200,
      });

      return;
    }
  }, [mapReady, location, currentUser]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${
        className ?? "h-full"
      }`}
    >
      <div
        ref={mapContainer}
        className="absolute inset-0 h-full w-full touch-none sm:touch-auto"
      />

      {mapReady && (
        <>
          <UserMarker map={map.current} location={location} />

          <PostsLayer
            map={map.current}
            posts={posts}
            onPostClick={(post) => {
              const coords = post?.location?.coordinates;

              if (coords && map.current) {
                map.current.easeTo({
                  center: [coords[0], coords[1]],
                  zoom: 14,
                });
              }

              setSelectedPost(post);
              onPostClick?.(post);
            }}
          />

          {selectedPost && (
            <MapPostPreview
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
              onView={() =>
                navigate("/explore", {
                  state: {
                    openPostId: selectedPost._id || selectedPost.id,
                  },
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
