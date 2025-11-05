import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
 transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,   // retry 5 times
  reconnectionDelay: 3000,
});
