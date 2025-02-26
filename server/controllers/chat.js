import {
  collection,
  addDoc,
  getDoc,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "../index.js";
import * as firebase from "firebase/app";

export const sendMessage = async (req, res) => {
  const currentTimestamp = Timestamp.fromDate(new Date());
  const message = {
    user: req.objectId,
    room: req.roomId,
    message: req.message,
    createAt: currentTimestamp,
  };
  const messageCollection = collection(getDb(), "messages");
  addDoc(messageCollection, message);
};
