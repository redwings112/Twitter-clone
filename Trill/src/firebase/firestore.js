import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchUsers = async () => {
  try {
    const usersCollection = collection(db, "users"); // Access the "users" collection
    const usersSnapshot = await getDocs(usersCollection);

    if (usersSnapshot.empty) {
      console.log("No users found in the collection.");
      return [];
    }

    const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error("Unable to retrieve users. Please try again later.");
  }
};
