import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  List,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyIcon from "@mui/icons-material/Reply";
import RepeatIcon from "@mui/icons-material/Repeat";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUsers } from "../../firebase/firestore";

// Define bad words list
const badWords = [
  "abuse", "alcoholic", "asshole", "bastard", "bitch", "blacklist", "bloodsucker", "blowjob",
  "bomb", "boobs", "bullshit", "cunt", "dick", "douchebag", "dyke", "fag", "faggot", "fuck",
  "gangbang", "goddamn", "homo", "idiot", "jackass", "jerk", "kike", "lesbian", "masturbation",
  "motherfucker", "nazi", "nigger", "piss", "porn", "prick", "pussy", "racist", "rape", "scum",
  "shit", "slut", "sodomize", "spic", "tits", "twat", "whore", "wop",
];

// Function to remove bad words from text
const removeBadWords = (text) => {
  let cleanedText = text;
  badWords.forEach((badWord) => {
    const regex = new RegExp(`\\b${badWord}\\b`, "gi"); // Matches the word as a whole
    cleanedText = cleanedText.replace(regex, "[REDACTED]");
  });
  return cleanedText;
};

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [badWordAlert, setBadWordAlert] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Set the current user when logged in
      } else {
        setCurrentUser(null); // Handle the case where no user is logged in
      }
    });
    return () => unsubscribe(); // Clean up the listener
  }, []);

  useEffect(() => {
    // Fetch users when the component mounts
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsers();
        setUsers(usersList);
      } catch (error) {
        console.error("Failed to load users:", error.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handlePostMessage = () => {
    if (input.trim() && currentUser) {
      const cleanedMessage = removeBadWords(input);
      if (cleanedMessage !== input) {
        setBadWordAlert("Your message contains inappropriate words.");
      } else {
        setBadWordAlert("");
        setPosts([
          ...posts,
          {
            id: Date.now(),
            userId: currentUser.uid,
            fullName: users.find((user) => user.id === currentUser.uid)?.fullName || "Anonymous",
            profileImage: users.find((user) => user.id === currentUser.uid)?.profileImage || null,
            text: cleanedMessage,
            liked: false,
            replies: [],
            reposted: false,
          },
        ]);
        setInput(""); // Clear input after successful post
      }
    }
  };

  const handleLikePost = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, liked: !post.liked } : post
    );
    setPosts(updatedPosts);
  };

  const handleReplyPost = (id) => {
    const replyText = replyInputs[id] || "";
    if (replyText.trim()) {
      const updatedPosts = posts.map((post) =>
        post.id === id
          ? { ...post, replies: [...post.replies, { fullName: currentUser.displayName || "Anonymous", text: replyText }] }
          : post
      );
      setPosts(updatedPosts);
      setReplyInputs({ ...replyInputs, [id]: "" }); // Clear the reply input for this post
    }
  };

  const handleRepost = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, reposted: !post.reposted } : post
    );
    setPosts(updatedPosts);
  };

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  const handleReplyInputChange = (id, value) => {
    setReplyInputs({ ...replyInputs, [id]: value });
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h4">
            Welcome, {currentUser ? currentUser.displayName || "Guest" : "Guest"}!
          </Typography>
        </Box>

        {/* New Post Section */}
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="What's happening?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostMessage()}
            error={!!badWordAlert}
            helperText={badWordAlert}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostMessage}
            sx={{ marginTop: 2 }}
            endIcon={<SendIcon />}
            disabled={!!badWordAlert}
          >
            Post
          </Button>
        </Box>

        {/* Users Section */}
        {loadingUsers ? (
          <CircularProgress />
        ) : (
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Active Users:
            </Typography>
            <List>
              {users.map((user) => (
                <Box key={user.id} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  {user.profileImage ? (
                    <Avatar src={user.profileImage} alt={user.fullName} sx={{ marginRight: 2 }} />
                  ) : (
                    <Avatar sx={{ marginRight: 2 }}>{user.fullName[0]}</Avatar>
                  )}
                  <Typography variant="body1">{user.fullName}</Typography>
                </Box>
              ))}
            </List>
          </Box>
        )}

        {/* Posts Section */}
        <List>
          {posts.map((post) => (
            <Box key={post.id} sx={{ marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {post.profileImage ? (
                  <Avatar src={post.profileImage} alt={post.fullName} sx={{ marginRight: 2 }} />
                ) : (
                  <Avatar sx={{ marginRight: 2 }}>{post.fullName[0]}</Avatar>
                )}
                <Typography variant="h6">{post.fullName}</Typography>
              </Box>

              <Typography variant="body1" sx={{ marginTop: 1 }}>
                {post.text}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton onClick={() => handleLikePost(post.id)}>
                  <FavoriteIcon color={post.liked ? "primary" : "default"} />
                </IconButton>
                <IconButton onClick={() => handleRepost(post.id)}>
                  <RepeatIcon color={post.reposted ? "primary" : "default"} />
                </IconButton>
                {currentUser && post.userId === currentUser.uid && (
                  <IconButton onClick={() => handleDeletePost(post.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Box>

              {/* Reply Section */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Reply..."
                  value={replyInputs[post.id] || ""}
                  onChange={(e) => handleReplyInputChange(post.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReplyPost(post.id)}
                />
                <IconButton onClick={() => handleReplyPost(post.id)} color="primary">
                  <ReplyIcon />
                </IconButton>
              </Box>

              {/* Show Replies */}
              {post.replies.length > 0 && (
                <Box sx={{ marginTop: 1, paddingLeft: 2 }}>
                  {post.replies.map((reply, index) => (
                    <Typography key={index} variant="body2">
                      {reply.fullName}: {reply.text}
                    </Typography>
                  ))}
                </Box>
              )}

              <Divider sx={{ marginTop: 2 }} />
            </Box>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default MainPage;
