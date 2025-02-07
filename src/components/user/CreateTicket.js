import {
  Alert,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../../api/ticket";
import UserHeader from "../shared/user/UserHeader.";

function CreateTicket() {
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "low",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!ticket.title.trim()) {
      newErrors.title = "Title is required";
    } else if (ticket.title.length < 4) {
      newErrors.title = "Title must be at least 4 characters long";
    }

    if (!ticket.description.trim()) {
      newErrors.description = "Description is required";
    } else if (ticket.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      await dispatch(createTicket(ticket)).unwrap();
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1000);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    }
  };
  return (
    <div>
      <UserHeader />

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create New Ticket
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={ticket.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
            />
            <InputLabel>Priority</InputLabel>

            <FormControl fullWidth margin="normal">
              <Select
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Create Ticket
            </Button>
          </form>
        </Paper>
        <Snackbar
          open={showSuccess}
          autoHideDuration={1500}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Ticket created successfully!
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default CreateTicket;
