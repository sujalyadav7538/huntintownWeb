import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserMetric, UserBadgeItem } from "../types";
import { apiFetch } from "../lib/api";
import type { RootState } from "./index";

interface ReputationState {
  metric: UserMetric | null;
  badges: UserBadgeItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReputationState = {
  metric: null,
  badges: [],
  status: "idle",
  error: null,
};

export const fetchReputation = createAsyncThunk(
  "reputation/fetch",
  async (_, thunkAPI) => {
    const [mRes, bRes] = await Promise.all([
      apiFetch("/api/profile/metrics"),
      apiFetch("/api/profile/badges"),
    ]);
    if (!mRes.ok) throw new Error("Failed to load metrics");
    if (!bRes.ok) throw new Error("Failed to load badges");
    const mData = await mRes.json();
    const bData = await bRes.json();
    return { metric: mData.metric ?? null, badges: bData.badges ?? [] };
  },
  {
    // Skip if already loading to prevent duplicate calls from multiple mounts
    condition: (_, { getState }) =>
      (getState() as RootState).reputation.status !== "loading",
  },
);

const reputationSlice = createSlice({
  name: "reputation",
  initialState,
  reducers: {
    resetReputation: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReputation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReputation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.metric = action.payload.metric;
        state.badges = action.payload.badges;
      })
      .addCase(fetchReputation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load reputation";
      });
  },
});

export const { resetReputation } = reputationSlice.actions;
export default reputationSlice.reducer;
