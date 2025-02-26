import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../chatContext";
import { db } from "../firebase-config";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

export default function Input() {
  const userdata = useSelector((state) => state.userdata);
  const { data } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const newMessageData = {
        chatId: data.chatId,
        content: newMessage,
        createdAt: serverTimestamp(),
        sender: userdata.userId,
      };

      await addDoc(collection(db, "Message"), newMessageData);

      const updateNewmess = doc(db, "Chat", data.chatId);
      await updateDoc(updateNewmess, {
        lastMess: newMessage,
        updateTime: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.inputContainer}>
      <input
        type="text"
        value={newMessage}
        style={styles.input}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <button type="submit" onClick={handleSubmit} style={styles.button}>
        Gửi
      </button>
    </div>
  );
}

const styles = {
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0084ff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};
