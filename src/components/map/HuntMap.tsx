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
    console.log("njinji",mapReady,map.current)
    // if (!mapReady || !map.current ) return;
    // 1. Browser GPS
    if (location) {
      console.log("Rendering GPS location")
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
      console.log("Rendering User location")
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
    console.log(bounds)
    if (hasPosts) {
      console.log("Rendering Cluster location")
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
      className={`relative w-full overflow-hidden border-2 border-[#1e1e22] bg-[#0e0e10] ${
        className ?? "h-[60vh] md:h-[440px]"
      } rounded-2xl  shadow-lg`}
    >
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full touch-none sm:touch-auto"
      />

      {mapReady && (
        <>
          {/* Recenter button */}
          <button
            aria-label="Recenter map"
            className="absolute left-3 top-3 z-20 inline-flex items-center justify-center w-10 h-10 bg-[#0b0b0d] border border-[#2a2a2f] rounded-md shadow-md text-white hover:brightness-110"
            onClick={() => {
              if (map.current && location) {
                map.current.easeTo({
                  center: [location.longitude, location.latitude],
                  zoom: 14,
                });
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5L3.5 3.5M20.5 20.5L19 19M19 5l1.5-1.5M4.5 20.5L6 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <UserMarker map={map.current} location={location} />
          {/* Posts layer renders markers and handles clicks */}
          <PostsLayer
            map={map.current}
            posts={posts}
            onPostClick={(post) => {
              // on small screens, center the clicked post for clarity
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
              // map={map.current}
              onClose={() => setSelectedPost(null)}
              onView={() => {
                navigate("/explore", {
                  state: {
                    openPostId: selectedPost._id || selectedPost.id,
                  },
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
