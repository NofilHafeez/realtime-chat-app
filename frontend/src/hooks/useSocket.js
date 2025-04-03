import { io } from 'socket.io-client';

// Initialize the socket
const socket = io(import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"
);

export default socket;