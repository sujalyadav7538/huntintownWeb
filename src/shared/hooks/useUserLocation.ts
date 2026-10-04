import { useEffect, useRef, useState } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function useUserLocation(watch = false) {
  const [location, setLocation] = useState<UserLocation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLoading(false);
      setError(null);
    };

    const failure = (err: GeolocationPositionError) => {
      setLoading(false);

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Location permission denied.");
          break;

        case err.POSITION_UNAVAILABLE:
          setError("Location unavailable.");
          break;

        case err.TIMEOUT:
          setError("Location request timed out.");
          break;

        default:
          setError("Unable to fetch location.");
      }
    };

    if (watch) {
      watchId.current = navigator.geolocation.watchPosition(success, failure, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      });
    } else {
      navigator.geolocation.getCurrentPosition(success, failure, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      });
    }

    return () => {
      if (watch && watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [watch]);

  return {
    location,
    loading,
    error,
  };
}
