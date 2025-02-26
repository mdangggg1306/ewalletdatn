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

  useEffect(() => {
    const getChats = () => {
      const chatQuery = query(
        collection(db, "Chat"),
        where("usersID", "array-contains", userdata.userId),
        orderBy("updateTime", "desc")
      );

      const unsub = onSnapshot(chatQuery, (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          chatId: doc.id,
        }));
        setChats(chatData);
      });

      return () => {
        unsub();
      };
    };
    getChats();
  }, [userdata.userId]);

  const handleSelected = (chat) => {
    dispatch({ type: "CHANGE_USER", payload: chat });
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
            <span style={styles.username}>
              {chat.usersID.find((id) => id !== userdata.userId)}
            </span>
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
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f0f2f5",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  userChatInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  username: {
    fontWeight: "600",
  },
  lastMessage: {
    color: "#65676b",
    margin: "0",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

export default Chats;
