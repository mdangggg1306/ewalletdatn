import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("esp32-connect", () => {
      console.log("ESP32 connected");
      socket.join("esp32-device");
    });

    socket.on("cardRead", async (cardID) => {
      // Notify all web clients about new card read
      io.emit("newCardRead", { cardID });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
