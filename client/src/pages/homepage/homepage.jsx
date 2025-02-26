import "./homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Profile from "../../components/profile";
import { Chat } from "../../components/chat";
import Transaction from "../transaction/transaction";
import ListTransaction from "../listtransaction/listTransaction";
import UserActivities from "../../components/useractivities";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "../../state";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("A");
  const dispatch = useDispatch();

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div style={styles.homepage}>
      <div style={styles.container}>
        <div style={styles.section1}>
          <div style={styles.bgSection1}>
            <img
              src="https://www.huce.edu.vn/theme1/images/gallery/Rectangle14.png"
              alt="DHXDHN"
              style={styles.headerImage}
            />
          </div>
          <div style={styles.header1}>
            <div>Trang chủ</div>
            <div>
              <button
                type="submit"
                onClick={() => dispatch(setLogout())}
                style={styles.logoutButton}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          </div>
        </div>
        <div style={styles.section2}>
          <div style={styles.sidebarContent}>
            <div style={styles.sidebarHeader}>
              <FontAwesomeIcon icon={faBars} style={styles.icon} />
              <div>Chức năng</div>
            </div>
            <div style={styles.sidebarBody}>
              {[
                "Thông tin cá nhân",
                "Lịch sử hoạt động",
                "Thực hiện giao dịch",
                "Lịch sử giao dịch",
                "Chat",
              ].map((option, index) => (
                <div key={index} style={styles.sidebarOption}>
                  <input
                    type="radio"
                    name="radioOptions"
                    value={String.fromCharCode(65 + index)}
                    checked={selectedOption === String.fromCharCode(65 + index)}
                    onChange={handleRadioChange}
                    id={`cb${index + 1}`}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={`cb${index + 1}`} style={styles.sidebarLabel}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.mainContent}>
            <div style={styles.mainHeader}>Ví điện tử</div>
            <div style={styles.mainBody}>
              {selectedOption === "A" && <Profile />}
              {selectedOption === "B" && <UserActivities />}
              {selectedOption === "C" && <Transaction />}
              {selectedOption === "D" && <ListTransaction />}
              {selectedOption === "E" && <Chat />}
            </div>
          </div>
        </div>
        <div style={styles.footer}>
          <div>Phòng quản lý và đào tạo</div>
          <div>Địa chỉ: Số 55 đường Giải Phóng, Hai Bà Trưng, Hà Nội</div>
          <div>
            Website: https://huce.edu.vn/ | Email: dhxaydung@huce.edu.vn
          </div>
          <div>Điện thoại: (024) 38 696 397 - Fax: 024.38.691.684</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  homepage: {
    display: "flex",
    justifyContent: "center",
    fontSize: "1rem",
    backgroundColor: "#f0f2f5",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1200px",
  },
  section1: {
    marginBottom: "30px",
  },
  bgSection1: {
    backgroundColor: "rgb(10, 109, 200)",
  },
  headerImage: {
    width: "100%",
    height: "auto",
  },
  header1: {
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    backgroundColor: "rgb(10, 109, 200)",
  },
  logoutButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  section2: {
    display: "grid",
    gridTemplateColumns: "1fr 4fr",
    gap: "40px",
    marginBottom: "30px",
  },
  sidebarContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sidebarHeader: {
    padding: "15px 20px",
    backgroundColor: "rgb(10, 109, 200)",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    fontSize: "1.2rem",
  },
  sidebarBody: {
    padding: "10px",
  },
  sidebarOption: {
    marginBottom: "10px",
  },
  sidebarLabel: {
    display: "block",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  mainContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  mainHeader: {
    padding: "15px 20px",
    backgroundColor: "rgb(10, 109, 200)",
    color: "white",
    fontSize: "1.2rem",
  },
  mainBody: {
    padding: "20px",
  },
  footer: {
    backgroundColor: "rgb(10, 109, 200)",
    color: "white",
    padding: "30px",
    textAlign: "center",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
};
