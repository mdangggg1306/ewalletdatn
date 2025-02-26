import React, { useState, useEffect } from "react";
import styles from "./RFIDModal.module.css";

export default function RFIDModal({ cardID, onClose }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cardID) {
      fetchServices();
    }
  }, [cardID]);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:3002/services");
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
    }
  };

  const handleServiceSelect = async (service) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3002/balance/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardID,
          serviceName: service.serviceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Payment result:", result);
      onClose();
    } catch (err) {
      setError("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cardID) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chọn Dịch Vụ</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.serviceList}>
          {services.map((service) => (
            <button
              key={service.objectId}
              onClick={() => handleServiceSelect(service)}
              disabled={loading}
              className={styles.serviceButton}
            >
              <span className={styles.serviceName}>{service.serviceName}</span>
              <span className={styles.servicePrice}>
                {service.amount.toLocaleString()} VND
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className={styles.cancelButton}
          disabled={loading}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
