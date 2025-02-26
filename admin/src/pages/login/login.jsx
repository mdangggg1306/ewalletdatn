import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../state.js";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = { userId, password };
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/login/admin",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const loggedIn = response.data;

      if (loggedIn) {
        dispatch(
          setLogin({
            userdata: loggedIn.userData,
            token: loggedIn.token,
          })
        );
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError("Không tìm thấy người dùng");
        } else if (error.response.status === 403) {
          setError("Không đủ quyền truy cập tài nguyên này");
        } else if (error.response.status === 402) {
          setError("Mật khẩu sai");
        }
      } else {
        setError("Lỗi không xác định");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="banner">
        <img
          src="https://media.huce.edu.vn/Media/2_SINHVIEN/FolderFunc/202304/Images/logo-dhxd-20230421015740-e.png"
          alt="HUCE Logo"
          className="banner-logo"
        />
      </div>

      <div className="login-container">
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <div className="form-header">
              <img
                src="https://media.huce.edu.vn/Media/2_SINHVIEN/FolderFunc/202304/Images/logo-dhxd-20230421015740-e.png"
                alt="logo"
                className="form-logo"
              />
              <h2>TRƯỜNG ĐẠI HỌC XÂY DỰNG HÀ NỘI</h2>
              <p className="login-title">Đăng nhập hệ thống</p>
            </div>
            <div className="form-group">
              <label htmlFor="userId">ADMIN ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                className="input-text"
                placeholder="Nhập ID"
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">MẬT KHẨU</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-text"
                placeholder="Nhập mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
