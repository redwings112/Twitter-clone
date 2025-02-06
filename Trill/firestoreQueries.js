// src/components/firebase/firestoreQueries.js

import { db } from "../../firebaseConfig";
import { collection, getDocs, query, limit } from "firebase/firestore";

/**
 * Fetches a limited number of users from the Firestore database.
 * @returns {Promise<Array>} An array of user objects.
 */
export const fetchLimitedUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersQuery = query(usersCollection, limit(10)); // Fetch only 10 users
    const usersSnapshot = await getDocs(usersQuery);
    const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return usersList;
  } catch (error) {
    console.error("Error fetching limited users:", error);
    throw new Error("Failed to fetch users: " + error.message);
  }
};
