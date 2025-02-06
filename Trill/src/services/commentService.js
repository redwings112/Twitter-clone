import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const addComment = async (postId, user, text) => {
  try {
    await addDoc(collection(db, `posts/${postId}/comments`), {
      user,
      text,
      timestamp: serverTimestamp(),
    });
    console.log("Comment added successfully!");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};


const fetchComments = (postId, setComments) => {
  const q = query(
    collection(db, `posts/${postId}/comments`),
    orderBy("timestamp", "desc")
  );
  onSnapshot(q, (snapshot) => {
    setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};
