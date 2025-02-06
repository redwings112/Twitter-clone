import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path if needed

const fetchPosts = (setPosts) => {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};

export { fetchPosts };
