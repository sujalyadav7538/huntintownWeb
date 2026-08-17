import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchReputation } from "../store/reputationSlice";
import { UserMetric, UserBadgeItem } from "../types";

interface ReputationState {
  metric: UserMetric | null;
  badges: UserBadgeItem[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useReputation(): ReputationState {
  const dispatch = useAppDispatch();
  const { metric, badges, status, error } = useAppSelector((s) => s.reputation);

  useEffect(() => {
    if (status === "idle") dispatch(fetchReputation());
  }, [status, dispatch]);

  return {
    metric,
    badges,
    loading: status === "loading",
    error,
    reload: () => dispatch(fetchReputation() as any),
  };
}

/** Derive a trust level label + styles from a trustScore (0-100) */

