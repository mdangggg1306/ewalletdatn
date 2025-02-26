import { collection, getDocs } from "firebase/firestore";
import { getDb } from "../index.js";
import * as firebase from "firebase/app";

// getall
export const getAllHistory = async (req, res) => {
  try {
    // getDb(); // Lấy đối tượng Firestore
    const usersCollection = collection(getDb(), "userhistories");
    const usersSnapshot = await getDocs(usersCollection);

    const usersData = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      userData.objectId = doc.id;
      usersData.push(userData);
    });
    return res.status(200).json(usersData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "failed", msg: error.message });
  }
};

//get by id
export const getHistory = async (req, res) => {
  try {
    const usersCollection = collection(getDb(), "userhistories");
    const userDetails = await getDocs(usersCollection);
    const usersData = [];
    userDetails.forEach((doc) => {
      const userdata = doc.data();
      userdata.objectId = doc.id;
      if (userdata.userId === req.params.id) {
        usersData.push(userdata);
      }
      // usersData.push(doc.data());
    });
    return res.status(200).json(usersData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
