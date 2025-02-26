import { 
    collection,
    doc,
    addDoc,
    getDoc,
    setDoc, 
    getDocs, 
    deleteDoc, 
    onSnapshot
} from "firebase/firestore";
import { getDb } from '../index.js';


// getall
export const getAllUsers = async (req, res) => {
   
        try {
            // getDb(); // Lấy đối tượng Firestore
            const usersCollection = collection(getDb(), "Users");
            const usersSnapshot = await getDocs(usersCollection);
    
            const usersData = [];
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                userData.objectId = doc.id;
                usersData.push(userData);
            });
            return res.status(200).json( usersData );
        } catch (error) {
            console.log(error);
            return res.status(500).send({ status: "failed", msg: error.message });
        }   

}

//get one
export const getUsers = async (req, res) => {
    try {
        // Lấy đối tượng Firestore
        const userDocRef = doc(getDb(), 'Users', req.params.id); // Đối tượng DocumentReference

        let responded = false; // Biến để kiểm tra xem đã gửi phản hồi hay chưa

        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (!responded) { // Kiểm tra xem đã gửi phản hồi hay chưa
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    res.status(200).json(userData);
                } else {
                    // Người dùng không tồn tại
                    res.status(404).send({ status: 'failed', msg: 'User not found' });
                }
                responded = true; // Đã gửi phản hồi
            }
        });
        // Ngừng lắng nghe khi không cần thiết
        // Dựa vào logic của bạn để quyết định khi nào ngừng lắng nghe, ví dụ, khi kết thúc kết nối của người dùng
        // unsubscribe(); 

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'failed', msg: error.message });
    }
}

//add one
export const addNewuser = async (req, res) => {
    try {
        const newdata = req.body;
        console.log(newdata)
        const usersCollection = collection(getDb(), "Users");
        const newDocRef = await addDoc(usersCollection, newdata);

       
        await setDoc(doc(getDb(), "userChats", newDocRef.id),{});

        return res.status(200).send({ status: "success", msg: "Data saved", docId: newDocRef.id });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "failed", msg: error.message });
    }

}

//update
export const updateUser = async (req, res) => {
    try{
        const usersCollection = collection(getDb(), "Users");
        const userDocRef = doc(usersCollection, req.params.id); 

        const userDetail = await getDoc(userDocRef);

        if (userDetail.exists()) {
            const newdata = req.body;
            console.log(newdata)
            const updateUser = await setDoc(userDocRef, newdata, { merge: true });
            const response = updateUser;
            return res.status(200).send({status:"success",msg:"data update", data: response})
        }
        else
            // Người dùng không tồn tại
            return res.status(404).send({ status: "failed", msg: "User not found" });
    }
    catch(error){
        console.error(error);
        return res.status(500).send({ status: "failed", msg: error.message });
    }
}


//delete
export const deleteUser = async (req, res) => {
    try{
        const usersCollection = collection(getDb(), "Users");
        const userDocRef = doc(usersCollection, req.params.id); 

        const userDetail = await getDoc(userDocRef);

        if (userDetail.exists()) {
            const deleteUser = await deleteDoc(userDocRef);
            const response = deleteUser;
            return res.status(200).send({status:"success",msg:"user deleted"})
        }
        else
            // Người dùng không tồn tại
            return res.status(404).send({ status: "failed", msg: "User not found" });
    }
    catch(error){
        res.status(500).send.apply({status:"failed", msg: error.message});
    }
}



