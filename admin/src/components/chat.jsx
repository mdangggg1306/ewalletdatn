import { useState, useEffect } from "react";
import Search from "../components/search";
import Chats from "./chats";
import Chatbox from "../components/chatbox";
import { useSelector } from "react-redux";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const Chat = () => {
  return (
    <div style={styles.container}>
      <div style={styles.chatBody}>
        <div style={styles.chatList}>
          <div style={styles.chatHeader}>
            <Search />
          </div>
          <h2 style={styles.chatTitle}>Cuộc trò chuyện của tôi</h2>
          <div style={styles.chatListContent}>
            <Chats />
          </div>
        </div>
        <div style={styles.boxchat}>
          <Chatbox />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f0f2f5",
  },
  chatBody: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "1200px",
    width: "100%",
    height: "600px",
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  chatList: {
    width: "300px",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  chatTitle: {
    fontSize: "1.2em",
    fontWeight: "700",
    padding: "15px 20px",
    margin: 0,
    borderBottom: "1px solid #e0e0e0",
  },
  chatListContent: {
    overflowY: "auto",
    flex: 1,
  },
  boxchat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
