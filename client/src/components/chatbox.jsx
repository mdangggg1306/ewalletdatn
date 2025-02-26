import React, { useContext, useEffect, useState } from "react";
import Messages from "./messages";
import Input from "./input";
import { ChatContext } from "../chatContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Chatbox() {
  const { data } = useContext(ChatContext);
  const [user, setUser] = useState("");

  const getUser = async (userId) => {
    const q = query(collection(db, "Users"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documentData = querySnapshot.docs[0].data();
      const username = documentData.username;
      setUser(username);
    }
  };

  useEffect(() => {
    if (data.user) {
      getUser(data.user.userId);
    }
  }, [data.user]);

  return (
    <div style={styles.boxchat}>
      <div style={styles.header}>
        <span style={styles.username}>{user}</span>
      </div>
      <div style={styles.chatFeed}>
        <Messages />
        <div
          ref={(el) => {
            el && (el.scrollTop = el.scrollHeight);
          }}
        ></div>
      </div>
      <div style={styles.inputContainer}>
        <Input />
      </div>
    </div>
  );
}

const styles = {
  boxchat: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  username: {
    fontSize: "1.2em",
    fontWeight: "600",
  },
  chatFeed: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
  inputContainer: {
    borderTop: "1px solid #e0e0e0",
    padding: "10px",
  },
};
