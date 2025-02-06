import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleProfilePage = () => {
    navigate("/profilepage");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 2,
        marginTop: "auto",
        backgroundColor: "#f1f1f1",
      }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
        © 2025 My Application. All rights reserved.
      </Typography>
      <Button variant="text" onClick={handleProfilePage}>
        Go to Profile Page
      </Button>
    </Box>
  );
};

export default Footer;
