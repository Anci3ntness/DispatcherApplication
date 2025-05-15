import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_HTTP_URL, {
    withCredentials: true,
    autoConnect: false,
    auth: {
        token: localStorage.getItem("token"),
    },
    transports: ["websocket"],
});
