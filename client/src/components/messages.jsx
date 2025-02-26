import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../chatContext";
import { db } from "../firebase-config";
import {
  collection,
  where,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const userdata = useSelector((state) => state.userdata);

  useEffect(() => {
    const getMessages = () => {
      const chatQuery = query(
        collection(db, "Message"),
        where("chatId", "==", data.chatId),
        orderBy("createdAt", "asc")
      );

      const unsub = onSnapshot(chatQuery, (snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(chatData);
      });

      return () => {
        unsub();
      };
    };
    if (data.chatId !== "null") {
      getMessages();
    }
  }, [data.chatId]);

  return (
    <div style={styles.messagesContainer}>
      {messages.map((m) => (
        <div key={m.id} style={styles.messageWrapper}>
          <div
            style={
              m.sender === userdata.userId
                ? styles.sentMessage
                : styles.receivedMessage
            }
          >
            <span style={styles.messageContent}>{m.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginbottom: "10px",
  },
  messageWrapper: {
    display: "flex",
    marginbottom: "10px",
  },
  sentMessage: {
    justifyContent: "flex-end",
    marginLeft: "auto",
  },
  receivedMessage: {
    justifyContent: "flex-start",
    marginRight: "auto",
  },
  messageContent: {
    backgroundColor: "#0084ff",
    color: "white",
    padding: "8px 12px",
    borderRadius: "18px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
};

export default Messages;
