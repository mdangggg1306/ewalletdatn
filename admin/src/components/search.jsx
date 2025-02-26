import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

export default function Search() {
  const [userid, setUserid] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const [chatid, setChatid] = useState(null);
  const userdata = useSelector((state) => state.userdata);

  const handleSearch = async () => {
    if (userid === userdata.userId) {
      setErr("Không thể tìm kiếm bản thân");
    } else {
      setUser(null);
      const q = query(collection(db, "Users"), where("userId", "==", userid));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } catch (err) {
        setErr("Khong tim thay nguoi dung");
      }
    }
  };

  const handleKey = (e) => {
    setErr("");
    e.key === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    try {
      const sortedUserIds = [userdata.userId, userid].sort();

      const q = query(
        collection(db, "Chat"),
        where("usersID", "==", sortedUserIds)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const room = [];
        querySnapshot.forEach((doc) => {
          const Chat = doc.data();
          Chat.chatId = doc.id;
          room.push(Chat);
        });
        setChatid(room[0].chatId);
      } else {
        const docRef = await addDoc(collection(db, "Chat"), {
          usersID: sortedUserIds,
          lastMess: "",
          updateTime: serverTimestamp(),
        });

        setChatid(docRef.id);
      }
    } catch (err) {
      console.log(err.message);
    }
    setUser(null);
    setUserid("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tìm người trò chuyện</h2>
      <div style={styles.searchContainer}>
        <input
          type="text"
          style={styles.input}
          onKeyDown={handleKey}
          onChange={(e) => setUserid(e.target.value)}
          value={userid}
          placeholder="Nhập ID người dùng"
        />
      </div>
      {user && (
        <div onClick={handleSelect} style={styles.userResult}>
          <div style={styles.userInfo}>
            <span>{user.username}</span>
          </div>
        </div>
      )}
      {err && <div style={styles.error}>{err}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    fontSize: "1.4em",
    fontWeight: "700",
    margin: "0 0 10px 0",
    color: "#333",
  },
  searchContainer: {
    position: "relative",
  },
  input: {
    width: "100%",
    height: "40px",
    padding: "0 3px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    outline: "none",
  },
  userResult: {
    background: "rgba(0,0,0,0.05)",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
  },
  userInfo: {
    fontSize: "1rem",
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};
