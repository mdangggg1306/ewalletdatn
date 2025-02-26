import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../../state";

export default function Sidebar() {
  const dispatch = useDispatch();

  const menuItems = [
    { to: "/homepage", text: "Home", icon: "🏠" },
    { to: "/users", text: "Users", icon: "👥" },
    { to: "/services", text: "Services", icon: "🛠️" },
    { to: "/activities", text: "User Histories", icon: "📜" },
    { to: "/transactions", text: "Transactions", icon: "💳" },
    { to: "/chat", text: "Chat", icon: "💬" },
    { to: "/deposit", text: "Deposit", icon: "💰" },
    { to: "/addUser", text: "Add User", icon: "➕" },
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>Admin Manage</h3>
      <ul style={styles.sidebarList}>
        {menuItems.map((item, index) => (
          <li key={index} style={styles.sidebarListItem}>
            <Link to={item.to} style={styles.link}>
              <span style={styles.icon}>{item.icon}</span>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
      <div style={styles.logoutContainer}>
        <button
          type="button"
          style={styles.logoutButton}
          onClick={() => dispatch(setLogout())}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    height: "100vh",
    width: "280px",
    backgroundColor: "#1a237e",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    padding: "10px 0",
    borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  sidebarList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  sidebarListItem: {
    marginBottom: "5px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    padding: "8px 15px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: "translateX(5px)",
    },
  },
  icon: {
    marginRight: "15px",
    fontSize: "20px",
  },
  logoutContainer: {
    marginTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    paddingTop: "20px",
    width: "100%",
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a237e",
    backgroundColor: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#f0f0f0",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  },
};
