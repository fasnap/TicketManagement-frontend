import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { Error, Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../../api/auth";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [successMessage, setSuccessMessage] = useState("");
  const { loading, error } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      navigate("/user/dashboard");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    } else if (!/^[a-zA-Z]+$/.test(username)) {
      newErrors.username = "Username must contain only letters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }
    if (password !== confirm_password) {
      newErrors.passwordMatch = "Passwords do not match"; // Set error if passwords don't match
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;
    try {
      await dispatch(
        register({ username, password, confirm_password })
      ).unwrap();
      setSuccessMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/user/login");
      }, 2000);
    } catch (err) {
      if (err?.username) {
        setErrors({
          username: err?.username || "An error occurred",
          form: err?.error?.message,
        });
      } else {
        setErrors({ form: err?.error || "Invalid username or password" });
      }
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
              Register
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
              <TextField
                label="Confirm Password"
                name="confirm_password"
                value={confirm_password}
                type="password"
                variant="outlined"
                fullWidth
                error={!!errors.confirm_password}
                helperText={errors.confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Typography color="error" variant="body2">
                {errors.passwordMatch ? errors.passwordMatch : ""}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <Typography gutterBottom>
                Already have an account? <Link to="/user/login">here</Link>.
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

export default UserRegister;
