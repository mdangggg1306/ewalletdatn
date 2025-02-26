export default function EditUser() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chỉnh sửa thông tin người dùng</h2>
      <div style={styles.formGroup}>
        <label htmlFor="balance" style={styles.label}>
          Số dư
        </label>
        <input type="text" name="balance" id="balance" style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="tuition" style={styles.label}>
          Học phí
        </label>
        <input type="text" name="tuition" id="tuition" style={styles.input} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5em",
    color: "#333",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};
