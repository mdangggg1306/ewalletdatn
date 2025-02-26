import React, { useEffect, useState } from "react";
import RFIDModal from "./RFIDModal";

export default function RFIDHandler() {
  const [cardID, setCardID] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "cardRead") {
          setCardID(data.cardID);
        } else if (data.type === "paymentResult") {
          setPaymentResult(data);
          // Reset payment result after 5 seconds
          setTimeout(() => setPaymentResult(null), 5000);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <RFIDModal cardID={cardID} onClose={() => setCardID(null)} />
      {paymentResult && (
        <div className={`payment-result ${paymentResult.status}`}>
          {paymentResult.message}
        </div>
      )}
    </>
  );
}
