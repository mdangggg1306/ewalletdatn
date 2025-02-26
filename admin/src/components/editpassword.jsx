export default function EditPassword() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đổi mật khẩu</h2>
      {/* Add password change form here */}
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
};
