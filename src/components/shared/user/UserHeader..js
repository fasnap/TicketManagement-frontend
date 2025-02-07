import React from "react";
import LogoutButton from "../../user/LogoutButton";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function UserHeader() {
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar position="static" sx={{ mb: 3, backgroundColor: "white" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "black", textDecoration: "none" }}
        >
          User Portal
        </Typography>
        <Box>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/user/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/user/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ color: "black", display: "inline", mr: 2 }}
              >
                Welcome, {user.username}!
              </Typography>
              <Button sx={{color:"white" ,mr:4, border:1 ,backgroundColor:"blue"}}component={Link} to="/user/dashboard">
                Dashboard
              </Button>
              <LogoutButton />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default UserHeader;
