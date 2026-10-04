import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchReputation } from "@/src/store/reputationSlice";
import { UserMetric, UserBadgeItem } from "@/src/shared/types";

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

