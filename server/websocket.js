import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

let wss;

export function setupWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "cardRead") {
          // Broadcast card read event to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "cardRead",
                  cardID: data.cardID,
                })
              );
            }
          });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });
  });

  return wss;
}

export function getWss() {
  if (!wss) {
    throw new Error("WebSocket server has not been initialized");
  }
  return wss;
}
