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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const [room, setRoom] = useState("");

  const userdata = useSelector((state) => state.userdata);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chatId", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messagesres = [];
      snapshot.forEach((doc) => {
        messagesres.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messagesres);
    });
    return () => unsuscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;
    await addDoc(messagesRef, {
      message: newMessage,
      createdAt: serverTimestamp(),
      user: userdata.username,
      userId: userdata.objectId,
      chatId: room,
    });
    console.log(newMessage);
    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBody}>
        <div style={styles.chatList}>
          <div style={styles.chatHeader}>
            <Search />
          </div>
          <div style={styles.chatTitle}>Cuộc trò chuyện của tôi</div>
          <div style={styles.chatsContainer}>
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
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  chatBody: {
    display: "flex",
    width: "80%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  chatList: {
    width: "30%",
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
    borderBottom: "1px solid #e0e0e0",
  },
  chatsContainer: {
    overflowY: "auto",
    flex: 1,
  },
  boxchat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
