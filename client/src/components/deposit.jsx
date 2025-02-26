import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Deposit() {
  const userdata = useSelector((state) => state.userdata);
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      const form = {
        amount: amount,
        userId: userdata.userId,
      };
      const response = await axios.post(
        "http://localhost:3002/vnpay/create_payment_url",
        form
      );
      window.location.replace(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Nạp tiền</h2>
      <div style={styles.body}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Nhập số tiền muốn nạp</label>
          <input
            type="text"
            style={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="VNĐ"
          />
        </div>
        <button onClick={handlePayment} style={styles.button}>
          Thanh toán qua cổng VNPAY
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "1.5em",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "1em",
    color: "#555",
    marginBottom: "5px",
  },
  input: {
    height: "40px",
    width: "100%",
    padding: "0 10px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "border-color 0.3s",
  },
  button: {
    color: "white",
    background: "rgb(10, 109, 200)",
    borderRadius: "5px",
    padding: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "1em",
    transition: "background 0.3s",
  },
};
