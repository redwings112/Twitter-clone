import React, { useState } from "react";
import { addPost } from "./services/postservice";

const PostForm = ({ user }) => {
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await addPost(user, text, imageURL);
      setText("");
      setImageURL("");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error submitting post:", error.message);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write your post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Image URL (optional)"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;


