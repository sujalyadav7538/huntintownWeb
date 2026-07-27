import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { UserMetric, UserBadgeItem } from "../types";

interface ReputationState {
  metric: UserMetric | null;
  badges: UserBadgeItem[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const DEFAULT_METRIC: UserMetric = {
  reviewMetrics: { averageRating: 0, totalReviews: 0, totalStars: 0, score: 0 },
  profileMetrics: { completion: 0, score: 0 },
  helperMetrics: {
    offersSubmitted: 0,
    offersAccepted: 0,
    acceptanceScore: 0,
    completedOffers: 0,
    cancelledOffers: 0,
    completionScore: 0,
  },
  trustScore: 0,
};

export function useReputation(): ReputationState {
  const [metric, setMetric] = useState<UserMetric | null>(null);
  const [badges, setBadges] = useState<UserBadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: token } : {};

      const [mRes, bRes] = await Promise.all([
        apiFetch("/api/profile/metrics", { headers }),
        apiFetch("/api/profile/badges", { headers }),
      ]);

      if (!mRes.ok) throw new Error("Failed to load metrics");
      if (!bRes.ok) throw new Error("Failed to load badges");

      const mData = await mRes.json();
      const bData = await bRes.json();

      setMetric(mData.metric ?? DEFAULT_METRIC);
      setBadges(bData.badges ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load reputation data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { metric, badges, loading, error, reload: fetchAll };
}

/** Derive a trust level label + styles from a trustScore (0-100) */

