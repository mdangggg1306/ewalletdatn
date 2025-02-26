import {
    collection,
    doc,
    addDoc,
    getDoc,
    setDoc,
    getDocs,
    where,
    query ,
    Timestamp,
} from "firebase/firestore";
import { getDb } from '../index.js';
import * as firebase from 'firebase/app';


// getall
export const getAllTransactions = async (req, res) => {
    try {
        // getDb(); // Lấy đối tượng Firestore
        const usersCollection = collection(getDb(), "transactions");
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
}

//add
export const addTran = async (req, res) => {
    try {
        const newdata = req.body;
        console.log(newdata)
        const usersCollection = collection(getDb(), "transactions");
        const newDocRef = await addDoc(usersCollection, newdata);

        return res.status(200).send({ status: "success", msg: "Data saved", docId: newDocRef.id });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "failed", msg: error.message });
    }

}

//get by id
export const getTransaction = async (req, res) => {
    try {
        const usersCollection = collection(getDb(), "transactions");
        const userDetails = await getDocs(usersCollection);
        const usersData = [];
        userDetails.forEach((doc) => {
            const userdata = doc.data();
            userdata.objectId = doc.id;
            if (userdata.createID === req.params.id || userdata.receiveID === req.params.id) {
                usersData.push(userdata);
            }
            // usersData.push(doc.data());
        });
        return res.status(200).json(usersData);

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }

}


//transfer
export const transfer = async (req, res) => {
    try {
        //lay user voiw userId = receiveId

        const usersCollection = collection(getDb(), "Users");
        const q = query(usersCollection, where('userId', '==', req.body.receiveID));
        const userDetails = await getDocs(q);
        if (userDetails.empty) {
            // Không tìm thấy người dùng có username cụ thể
            return res.status(404).json({ status: 'failed', msg: 'User not found' });
        }
        const receiveData = []
        userDetails.forEach((doc) => {
            const newdata = doc.data();
            newdata.objectId = doc.id;
            receiveData.push(newdata);
        })

        //kierm tra so du createId
        const userDocRef = doc(getDb(), "Users", req.body.objectId);
        const userDetail = await getDoc(userDocRef);
        const sendData = userDetail.data();
        sendData.objectId = userDetail.id;

        if (sendData.balance < req.body.amount) {
            return res.status(403).json("so du khong du");
        }

        //update receiveID
        receiveData[0].balance = receiveData[0].balance + req.body.amount;
        const receiveDocRef = doc(getDb(), "Users", receiveData[0].objectId)
        const updateReceive = await setDoc(receiveDocRef, receiveData[0], { merge: true })

        //update createID
        sendData.balance = sendData.balance - req.body.amount;
        const updateSend = await setDoc(userDocRef, sendData, { merge: true });
        //add transaction   

        const currentTimestamp = Timestamp.fromDate(new Date());
        const newdata = {
            type: "Chuyển tiền",
            createID: sendData.userId ,
            receiverName: receiveData[0].username,
            createTime : currentTimestamp,
            amount: req.body.amount,
            method: "none",
            receiveID: req.body.receiveID,
        }
        const tranCollection = collection(getDb(), "transactions");
        const newDocRef = await addDoc(tranCollection, newdata);

        return res.status(200).json({docID: newDocRef.id });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}


//deposit admin
export const depositadmin = async (req, res) => {
    try {
        //lay user voiw userId = receiveId

        const usersCollection = collection(getDb(), "Users");
        const q = query(usersCollection, where('userId', '==', req.body.receiveID));
        const userDetails = await getDocs(q);
        if (userDetails.empty) {
            // Không tìm thấy người dùng có username cụ thể
            return res.status(404).json({ status: 'failed', msg: 'User not found' });
        }
        const receiveData = []
        userDetails.forEach((doc) => {
            const newdata = doc.data();
            newdata.objectId = doc.id;
            receiveData.push(newdata);
        })

        //update receiveID
        receiveData[0].balance = receiveData[0].balance + req.body.amount;
        const receiveDocRef = doc(getDb(), "Users", receiveData[0].objectId)
        const updateReceive = await setDoc(receiveDocRef, receiveData[0], { merge: true })
        //add transaction   

        const currentTimestamp = Timestamp.fromDate(new Date());
        const newdata = {
            type: "Nạp tiền",
            createID: "adminn" ,
            receiverName: receiveData[0].username,
            createTime : currentTimestamp,
            amount: req.body.amount,
            method: "Tiền mặt",
            receiveID: req.body.receiveID,
        }
        const tranCollection = collection(getDb(), "transactions");
        const newDocRef = await addDoc(tranCollection, newdata);

        return res.status(200).json({docID: newDocRef.id, balance: receiveData[0].balance, amount:req.body.amount });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}