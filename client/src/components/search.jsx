import React, { useState, useContext } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { ChatContext } from "../chatContext";

export default function Search() {
  const [userid, setUserid] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const userdata = useSelector((state) => state.userdata);
  const { dispatch } = useContext(ChatContext);

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
        setErr("Không tìm thấy người dùng");
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
      let chatId;
      if (!querySnapshot.empty) {
        const room = [];
        querySnapshot.forEach((doc) => {
          const Chat = doc.data();
          Chat.chatId = doc.id;
          room.push(Chat);
        });
        chatId = room[0].chatId;
      } else {
        const docRef = await addDoc(collection(db, "Chat"), {
          usersID: sortedUserIds,
          lastMess: "",
          updateTime: serverTimestamp(),
        });
        chatId = docRef.id;
      }
      dispatch({ type: "CHANGE_USER", payload: { chatId, user: user } });
    } catch (err) {
      console.log(err.message);
    }
    setUser(null);
    setUserid("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Tìm người trò chuyện</div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          style={styles.input}
          placeholder="Nhập ID người dùng"
          onKeyDown={handleKey}
          onChange={(e) => setUserid(e.target.value)}
          value={userid}
        />
      </div>
      {user && (
        <div onClick={handleSelect} style={styles.userResult}>
          <div className="userChatInfo">
            <span style={styles.username}>{user.username}</span>
          </div>
        </div>
      )}
      {err && (
        <div style={styles.error}>
          <span>{err}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    fontSize: "1.2em",
    fontWeight: "700",
    marginBottom: "10px",
  },
  searchContainer: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  userResult: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f0f2f5",
    borderRadius: "8px",
    cursor: "pointer",
  },
  username: {
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
