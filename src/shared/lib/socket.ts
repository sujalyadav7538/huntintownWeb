import { io } from "socket.io-client";

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  undefined;

export const socket = io(BASE, {
  autoConnect: false,

  // Let socket.io fall back to polling if websocket upgrade fails
  transports: ["polling", "websocket"],

  auth: {
    token: "",
  },

  withCredentials: true,

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
});

export function setSocketAuth(token: string) {
  socket.auth = { token };
}

socket.on("connect", () => {
  console.log("✅ Connected");
  console.log("Socket ID:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connect Error:", err.message);
});
