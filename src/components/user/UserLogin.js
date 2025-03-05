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
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);

  const { loading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate("/user/dashboard");
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
      console.log(result);
      if (result?.access) {
        navigate("/"); // Redirect only if login is successful
      }
    } catch (err) {
      setErrors({ form: err?.error || "Invalid username or password" });
    }
  };

  return (
    <div>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "gray",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={5}
            sx={{
              padding: 5,
              textAlign: "center",
              borderRadius: 3,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Lock fontSize="large" color="primary" />
            <Typography variant="h5" gutterBottom>
              User Login
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
                error={!!errors.username}
                helperText={errors.username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                name="password"
                value={password}
                type="password"
                variant="outlined"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
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
              <Typography gutterBottom>
                Don't have an account?  <Link to="/user/register">here</Link>.
              </Typography>
              {errors.form && (
                <Typography color="error">{errors.form}</Typography>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </div>
  );
}

export default UserLogin;
