import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { Error, Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../../api/auth";
import * as yup from "yup";

function UserRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [successMessage, setSuccessMessage] = useState("");
  const { error } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      navigate("/user/dashboard");
    }
  }, [user, navigate]);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters")
      .matches(/^[a-zA-Z]+$/, "Username must contain only letters"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(/[0-9]/, "Password must have at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must have at least one special character"
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords do not match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (e) => {
    console.log("submit clicked");
    e.preventDefault();
    try {
      await validationSchema.validate(
        { username, password, confirm_password },
        { abortEarly: false }
      );
      console.log("validated");
      setErrors({});
      setLoading(true);
      console.log("before dispatching","username", username,"password", password);
      await dispatch(
        register({ username, password, confirm_password })
      ).unwrap();
         
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/user/login"), 2000);
    } catch (err) {
      console.log("error", err);
      if (err) {
        setErrors(err);
      } else if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else if (err.message) {
        setErrors({ server: err.message });
      }
    } finally {
      setLoading(false);
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
              {successMessage && (
                <Alert severity="success">{successMessage}</Alert>
              )}
              {errors.server && <Alert severity="error">{errors.server}</Alert>}

              <Typography gutterBottom>
                Already have an account? <Link to="/user/login">here</Link>.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </div>
  );
}

export default UserRegister;
