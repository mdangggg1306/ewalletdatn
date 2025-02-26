import React, { useState } from "react";
import axios from "axios";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [receiveID, setReceiveID] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    const newAmount = parseFloat(amount);
    const newdata = {
      amount: newAmount,
      receiveID: receiveID,
    };
    try {
      await axios.post(
        "http://localhost:3002/transactions/depositadmin",
        newdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Không tìm thấy người dùng");
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Nạp tiền</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>Người nhận</label>
        <input
          type="text"
          style={styles.input}
          value={receiveID}
          onChange={(e) => setReceiveID(e.target.value)}
          placeholder="Nhập ID người nhận"
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Số tiền muốn nạp</label>
        <input
          type="text"
          style={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
        />
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <button style={styles.button} onClick={handleDeposit}>
        Nạp tiền
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "450px",
    margin: "40px auto",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease-in-out",
  },
  header: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#2c3e50",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  formGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#34495e",
    fontSize: "16px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "16px",
    color: "#2c3e50",
    border: "2px solid #bdc3c7",
    borderRadius: "8px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    ":focus": {
      outline: "none",
      borderColor: "#3498db",
    },
  },
  error: {
    color: "#e74c3c",
    fontSize: "14px",
    marginBottom: "15px",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#fadbd8",
    borderRadius: "6px",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    padding: "15px",
    fontSize: "18px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#3498db",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.1s ease",
    ":hover": {
      backgroundColor: "#2980b9",
    },
    ":active": {
      transform: "scale(0.98)",
    },
  },
};
