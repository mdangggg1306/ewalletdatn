import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getDb } from "../index.js";

// getall
export const getAllservices = async (req, res) => {
  try {
    // getDb(); // Lấy đối tượng Firestore
    const servicesCollection = collection(getDb(), "services");
    const servicesSnapshot = await getDocs(servicesCollection);

    const servicesData = [];
    servicesSnapshot.forEach((doc) => {
      const userData = doc.data();
      userData.objectId = doc.id;
      servicesData.push(userData);
    });
    console.log(servicesData);
    return res.status(200).json(servicesData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "failed", msg: error.message });
  }
};

// }
//add one
export const addNewServices = async (req, res) => {
  try {
    const newdata = req.body;
    console.log(newdata);
    const servicesCollection = collection(getDb(), "services");
    const newDocRef = await addDoc(servicesCollection, newdata);

    return res.status(200).send({
      status: "success",
      msg: "Data saved",
      objectId: newDocRef.id,
      serviceName: newdata.serviceName,
      price: newdata.price,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "failed", msg: error.message });
  }
};

//update
export const updateServices = async (req, res) => {
  try {
    const servicesCollection = collection(getDb(), "services");
    const userDocRef = doc(servicesCollection, req.params.id);

    const userDetail = await getDoc(userDocRef);

    if (userDetail.exists()) {
      const newdata = req.body;
      console.log(newdata);
      const updateUser = await setDoc(userDocRef, newdata, { merge: true });
      const response = updateUser;
      return res
        .status(200)
        .send({ status: "success", msg: "data update", data: response });
    }
    // Người dùng không tồn tại
    else
      return res
        .status(404)
        .send({ status: "failed", msg: "Services not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "failed", msg: error.message });
  }
};

//delete
export const deleteServices = async (req, res) => {
  try {
    const servicesCollection = collection(getDb(), "services");
    const userDocRef = doc(servicesCollection, req.params.id);

    const userDetail = await getDoc(userDocRef);

    if (userDetail.exists()) {
      const deleteUser = await deleteDoc(userDocRef);
      return res
        .status(200)
        .send({ status: "success", msg: "services deleted" });
    }
    // Người dùng không tồn tại
    else
      return res
        .status(404)
        .send({ status: "failed", msg: "Sevices not found" });
  } catch (error) {
    res.status(500).send.apply({ status: "failed", msg: error.message });
  }
};
