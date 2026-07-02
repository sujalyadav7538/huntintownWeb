import { io } from "socket.io-client";

const BASE = import.meta.env.VITE_API_BASE_URL;

export const socket = io(BASE, {
  autoConnect: false,
  auth: {
    token: "",
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("✅ Socket Connected, ID:", socket.id);
  console.log("   Auth token on connect:", socket.auth?.token ? "✅ Set" : "❌ Missing");
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket Disconnected, reason:", reason);
});

socket.on("connect_error", (err: any) => {
  console.error("🚨 Socket Connect Error:", err.message);
  console.error("   Error details:", err);
});

socket.on("error", (err: any) => {
  console.error("🚨 Socket Error:", err);
});

// Export a helper to safely set auth
export function setSocketAuth(token: string) {
  console.log("[setSocketAuth] Setting token (length: " + token.length + ")");
  socket.auth = { token };
  console.log("[setSocketAuth] Token set on socket.auth");
}
