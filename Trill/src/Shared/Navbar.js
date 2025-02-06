import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Sign out user from Firebase
      await signOut(auth);

      // Clear currentUser state
      setCurrentUser(null);

      // Redirect to the sign-in page
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleProfilePage = () => {
    // Navigate to Profile Page
    navigate("/profilepage");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Trill
        </Typography>
        <Box>
          {currentUser ? (
            <>
              <Button color="inherit" onClick={handleProfilePage}>
                Profile Page
              </Button>
              <Button color="inherit" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
