import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/admin";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);

  const { loading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setErrors(error);
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!username.trim() || !password.trim()) {
      setErrors({
        username: !username.trim() ? "Username is required" : "",
        password: !password.trim() ? "Password is required" : "",
      });
      return;
    }
    try {
      const result = await dispatch(login({ username, password })).unwrap();
      if (result?.access) {
        navigate("/admin/dashboard"); // Redirect only if login is successful
      }
    } catch (err) {
      setErrors({ form: err?.error || "Invalid username or password" });
    }
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ padding: 4, marginTop: 10, textAlign: "center" }}
        >
          <Lock fontSize="large" color="primary" />
          <Typography variant="h5" gutterBottom>
            Admin Login
          </Typography>
          {error && <Typography color="error">{error.message}</Typography>}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              name="username"
              value={username}
              variant="outlined"
              fullWidth
              error={!!errors?.username}
              helperText={errors?.username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              name="password"
              value={password}
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors?.password}
              helperText={errors?.password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {errors?.form && (
              <Typography color="error">{errors?.form}</Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminLogin;
