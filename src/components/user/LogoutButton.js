import { Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/user/login");
  };
  return (
    <Button variant="contained" color="warning" onClick={handleLogout}>
      <Typography>Logout</Typography>
    </Button>
  );
}

export default LogoutButton;
