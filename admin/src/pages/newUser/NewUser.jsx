import { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

export default function NewUser() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState("");
  const [cardID, setCardid] = useState("");
  const [tuition, setTuition] = useState("");

  const handleAddnew = async (e) => {
    e.preventDefault();
    const saltRounds = 10;
    const plainPassword = "1"; // Default password

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const form = {
      username,
      userId,
      password: hashedPassword,
      balance: parseFloat(balance),
      cardID,
      tuition,
      role: "user",
      active: true,
    };

    try {
      await axios.post("http://localhost:3002/users/create", form, {
        headers: { "Content-Type": "application/json" },
      });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 500)
        console.log(error.response);
    }
  };

  return (
    <div style={styles.newUser}>
      <h1 style={styles.newUserTitle}>Tạo người dùng mới</h1>
      <form style={styles.newUserForm} onSubmit={handleAddnew}>
        <div style={styles.formRow}>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Họ và tên</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Nguyễn Văn A"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Mã sinh viên</label>
            <input
              style={styles.input}
              type="text"
              placeholder="11203502"
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Số dư tài khoản</label>
            <input
              style={styles.input}
              type="number"
              placeholder="1000000"
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Thẻ thanh toán</label>
            <input
              style={styles.input}
              type="text"
              placeholder="1234 5678 9012 3456"
              onChange={(e) => setCardid(e.target.value)}
              required
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Học phí</label>
            <input
              style={styles.input}
              type="number"
              placeholder="10000000"
              onChange={(e) => setTuition(e.target.value)}
              required
            />
          </div>
          <div style={styles.newUserItem}>
            <label style={styles.label}>Mật khẩu</label>
            <input style={styles.input} type="text" value="1" disabled />
          </div>
        </div>
        <button style={styles.newUserButton} type="submit">
          Thêm người dùng
        </button>
      </form>
    </div>
  );
}

const styles = {
  newUser: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "20px auto",
  },
  newUserTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "24px",
    textAlign: "center",
  },
  newUserForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formRow: {
    display: "flex",
    gap: "20px",
  },
  newUserItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    transition: "border-color 0.3s ease",
  },
  newUserButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    alignSelf: "flex-start",
    marginTop: "10px",
  },
};
