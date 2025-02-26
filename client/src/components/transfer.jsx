import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Transfer() {
  const userdata = useSelector((state) => state.userdata);
  const [amount, setAmount] = useState("");
  const [receiveID, setReceiveID] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    const newAmount = parseFloat(amount);
    const newdata = {
      objectId: userdata.objectId,
      amount: newAmount,
      receiveID: receiveID,
    };
    try {
      const response = await axios.post(
        "http://localhost:3002/transactions/transfer",
        newdata,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setError("Giao dịch thành công");
    } catch (error) {
      if (error.response.status === 404) {
        setError("Không tìm thấy người dùng");
      } else if (error.response.status === 403) {
        setError("Số dư không đủ");
      } else {
        setError("Lỗi không xác định");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chuyển tiền</h2>
      <div style={styles.body}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Người nhận</label>
          <div style={styles.searchContainer}>
            <input
              type="text"
              style={styles.input}
              value={receiveID}
              onChange={(e) => setReceiveID(e.target.value)}
              placeholder="Nhập ID người nhận"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={styles.searchIcon}
            />
          </div>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Số tiền muốn chuyển</label>
          <input
            type="text"
            style={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="VNĐ"
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} onClick={handleTransfer}>
          Chuyển tiền
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
  searchContainer: {
    position: "relative",
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
  searchIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#888",
  },
  error: {
    color: "red",
    fontSize: "0.9em",
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
