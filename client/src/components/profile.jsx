import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { db } from "../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import { setLogout } from "../state";
import bcrypt from "bcryptjs";

export default function Profile() {
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.userdata);
  const [editingService, setEditingService] = useState(null);
  const [checkpassword, setCheckpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isdebt, setDebt] = useState(false);
  const [isdebtmode, setDebtmode] = useState(false);
  const [isdebtNotification, setDebtNotification] = useState(false);
  const [isdelete, setDelete] = useState(false);
  const [isdeletemode, setDeletemode] = useState(false);

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/users/${userdata.objectId}`
      );
      const userInfo = await response.data;
      console.log(userInfo);
      console.log(userInfo.tuition);
      if (userInfo.active === false) {
        setDelete(false);
      } else {
        setDelete(true);
      }
      setData(userInfo);

      convertPassword(userInfo.password);
    } catch (error) {
      console.error(error);
    }
  }, [userdata.objectId]);

  const handleDebtNotificationClose = () => {
    // Đặt state để ẩn thông báo nợ học phí
    setDebtNotification(false);
  };

  useEffect(() => {
    getUser();

    const userDocRef = doc(db, "Users", userdata.objectId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log(userData);

        setData(userData); // Cập nhật dữ liệu trong giao diện
        if (userData.tuition === 0) {
          setDebt(false);
          setDebtNotification(false);
        } else {
          setDebt(true);
          setDebtNotification(true);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userdata, getUser]);

  const convertPassword = (params) => {
    const pass = "*".repeat(params.length);
    setPassword(pass);
  };
  const handleEditClick = (params) => {
    setEditingService(params);
  };

  const handleSaveClick = async () => {
    // Sử dụng bcrypt.compare để so sánh mật khẩu nhập vào với mật khẩu mã hóa
    const isMatch = await bcrypt.compare(checkpassword, data.password);

    if (isMatch) {
      const updateData = {
        password: await bcrypt.hash(newpassword, 10), // Mã hóa mật khẩu mới
      };

      try {
        await axios.put(
          `http://localhost:3002/users/update/${userdata.objectId}`,
          updateData,
          { headers: { "Content-Type": "application/json" } }
        );
        setEditingService(null);
        window.location.reload();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(error.response.send);
        } else {
          console.log("Khong xac dinh");
        }
      }
    } else {
      setError("Mật khẩu hiện tại không đúng.");
    }
  };

  const handleCloseClick = () => {
    if (isdebtmode) {
      setDebtmode(false);
    }
    if (editingService) {
      setEditingService(false);
    }
    if (isdeletemode) {
      setDeletemode(false);
    }
  };

  const handleDebtClick = () => {
    setDebtmode(true);
    setError("");
  };

  const handleYesClick = async () => {
    const isMatch = await bcrypt.compare(checkpassword, data.password);
    if (isMatch) {
      if (data.tuition <= data.balance) {
        const newbalance = data.balance - data.tuition;
        const updateData = {
          tuition: 0,
          balance: newbalance,
        };
        try {
          await axios.put(
            `http://localhost:3002/users/update/${userdata.objectId}`,
            updateData,
            { headers: { "Content-Type": "application/json" } }
          );
          setEditingService(null);
        } catch (error) {
          if (error.response)
            if (error.response.status === 404) {
              console.log(error.response.send);
            } else {
              console.log("Khong xac dinh");
            }
        }
        handleCloseClick();
      } else {
        setError("Số dư tài khoản không đủ");
      }
    } else {
      setError("Mật khẩu hiện tại không đúng");
    }
  };
  const Delete = async () => {
    try {
      if (checkpassword === data.password) {
        await axios.delete(
          `http://localhost:3002/users/delete/${userdata.objectId}`
        );
        dispatch(setLogout());
      } else {
        setError("Mật khẩu hiện tại không đúng");
      }
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };
  const handleDeleteClick = () => {
    try {
      setDeletemode(true);
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };
  return (
    <div style={{ backgroundColor: "white", padding: "20px" }}>
      <div
        className="header-profile"
        style={{
          fontSize: "2em",
          fontWeight: "700",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>Thông tin cá nhân</div>
      </div>
      <div
        className="header-title"
        style={{
          fontSize: "0.7em",
          color: "red",
          fontWeight: "700",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!isdelete && (
          <span>
            Tài khoản sẽ bị xóa hãy kiểm tra lại tài khoản và chấp nhận
          </span>
        )}
      </div>
      <div
        className="body-profile"
        style={{ padding: "30px 30px", fontSize: "1.3em" }}
      >
        <div className="body-section">
          <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Họ và tên:
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {data.username}
            </div>
          </div>
          <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Mã sinh viên:
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {data.userId}
            </div>
          </div>
          {/* <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Password:
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {password}
            </div>
          </div> */}
          <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Số dư tài khoản:
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {data.balance}
            </div>
          </div>
          <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Thông tin thẻ thanh toán:
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {data.cardID}
            </div>
          </div>
          <div className="info" style={{ padding: "5px" }}>
            <div style={{ fontWeight: 600, paddingBottom: "3px" }}>
              Tình hình học phí ( nợ? ):
            </div>
            <div
              style={{
                height: "23px",
                padding: "10px",
                paddingLeft: "20px",
                borderRadius: "10px",
                background: " rgba(0,0,0,0.15)",
              }}
            >
              {data.tuition}
            </div>
          </div>
          <div className="info" style={{ padding: "5px" }}>
            <Button variant="contained" onClick={handleEditClick}>
              Đổi mật khẩu
            </Button>
            {isdebt ? (
              <Button
                variant="contained"
                style={{ marginLeft: "20px" }}
                onClick={handleDebtClick}
              >
                Nộp học phí
              </Button>
            ) : null}
            {!isdelete ? (
              <Button
                variant="contained"
                style={{ marginLeft: "20px" }}
                onClick={handleDeleteClick}
              >
                Xóa tài khoản
              </Button>
            ) : null}
            {isdeletemode ? (
              <>
                <Dialog open={true} onClose={handleCloseClick}>
                  <DialogTitle>
                    <span>Tài khoản sẽ bị xóa và đăng xuất</span>
                  </DialogTitle>
                  <DialogContent>
                    <div style={{ fontSize: "1.2rem", paddingBottom: "20px" }}>
                      {userdata.userId}
                    </div>
                    <TextField
                      label="Password"
                      fullWidth
                      value={checkpassword}
                      onChange={(e) => setCheckpassword(e.target.value)}
                    />
                    {error && (
                      <div style={{ color: "red", paddingTop: "5px" }}>
                        {error}
                      </div>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={Delete}>
                      YES
                    </Button>
                    <Button color="primary" onClick={handleCloseClick}>
                      NO
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : null}
            {isdebtmode ? (
              <div>
                <Dialog open={true} onClose={handleCloseClick}>
                  <DialogTitle>Bạn có chắc sẽ nộp học phí</DialogTitle>
                  <DialogContent>
                    <div style={{ fontSize: "1.2rem", paddingBottom: "20px" }}>
                      {userdata.userId}
                    </div>
                    <TextField
                      label="Password"
                      fullWidth
                      value={checkpassword}
                      onChange={(e) => setCheckpassword(e.target.value)}
                    />
                    {error && (
                      <div style={{ color: "red", paddingTop: "5px" }}>
                        {error}
                      </div>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleYesClick}>
                      YES
                    </Button>
                    <Button color="primary" onClick={handleCloseClick}>
                      NO
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            ) : null}

            {editingService ? (
              <Dialog open={true} onClose={handleCloseClick}>
                <DialogTitle>Cập nhật mật khẩu</DialogTitle>
                <DialogContent>
                  <div style={{ fontSize: "1.2rem", paddingBottom: "20px" }}>
                    {userdata.userId}
                  </div>
                  <TextField
                    label="Password"
                    fullWidth
                    value={checkpassword}
                    onChange={(e) => setCheckpassword(e.target.value)}
                  />
                  <TextField
                    style={{ paddingTop: "10px" }}
                    label="New Password"
                    fullWidth
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
                  />
                  {error && (
                    <div style={{ color: "red", paddingTop: "5px" }}>
                      {error}
                    </div>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={handleCloseClick}>
                    Hủy bỏ
                  </Button>
                  <Button color="primary" onClick={handleSaveClick}>
                    Lưu
                  </Button>
                </DialogActions>
              </Dialog>
            ) : null}
          </div>
        </div>
      </div>
      {/* Hiển thị thông báo nếu nợ học phí */}
      {isdebtNotification && (
        <Dialog open={true} onClose={handleDebtNotificationClose}>
          <DialogTitle>Thông báo nợ học phí</DialogTitle>
          <DialogContent>
            <div style={{ fontSize: "1.2rem", paddingBottom: "20px" }}>
              Bạn đang nợ học phí.
              <div>Hãy kiểm tra và nộp học phí</div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleDebtNotificationClose}>
              Đã hiểu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
