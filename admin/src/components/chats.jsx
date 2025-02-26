import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { ChatContext } from "../chatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const userdata = useSelector((state) => state.userdata);
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const chatQuery = query(
        collection(db, "Chat"),
        where("usersID", "array-contains", userdata.userId),
        orderBy("updateTime", "asc")
      );

      const unsub = onSnapshot(chatQuery, (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          chatId: doc.id,
        }));
        setChats(chatData);
        sort(chatData);
      });

      return () => {
        unsub();
      };
    };
    getChats();
  }, [userdata.userId]);

  const sort = (u) => {
    u.forEach((e) => {
      if (e.usersID[0] !== userdata.userId) {
        const tg = e.usersID[0];
        e.usersID[0] = e.usersID[1];
        e.usersID[1] = tg;
      }
    });
  };

  const handleSelected = (chatId) => {
    dispatch({ type: "CHANGE_USER", payload: chatId });
  };

  return (
    <div style={styles.chats}>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          style={styles.chatItem}
          onClick={() => handleSelected(chat)}
        >
          <div style={styles.userChatInfo}>
            <span style={styles.username}>{chat.usersID[1]}</span>
            <p style={styles.lastMessage}>{chat.lastMess}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  chats: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
  },
  chatItem: {
    background: "rgba(0,0,0,0.05)",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  userChatInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  username: {
    fontSize: "1.1em",
    fontWeight: "600",
    color: "#333",
  },
  lastMessage: {
    color: "#666",
    margin: "0",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export default Chats;
