import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import UserHeader from "../shared/user/UserHeader.";

function Home() {
  return (
    <>
      <UserHeader />
      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            boxShadow: 3,
            p: 5,
            borderRadius: 2,
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome to the User Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            A seamless platform for managing your tickets with ease.
          </Typography>
          <Box
            sx={{
              bgcolor: "#f9f9f9",
              p: 3,
              borderRadius: 2,
              textAlign: "left",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Key Features:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              ✅ Create, track, and manage your tickets effortlessly.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              ✅ Receive updates on ticket progress.
            </Typography>
            <Typography variant="body1">
              ✅ Enjoy a simple and user-friendly experience.
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;
