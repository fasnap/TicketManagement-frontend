import React, { useEffect, useState } from "react";
import {
  deleteTicket,
  fetchSingleTicket,
  updateTicket,
} from "../../api/ticket";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AdminHeader from "../shared/admin/AdminHeader";

function AdminTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTicket, loading } = useSelector((state) => state.ticket);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedTicket, setEditedTicket] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!selectedTicket || selectedTicket.id !== parseInt(ticketId)) {
      dispatch(fetchSingleTicket(ticketId));
    }
  }, [ticketId, dispatch, selectedTicket]);
  useEffect(() => {
    if (selectedTicket) {
      setEditedTicket({
        title: selectedTicket.title,
        description: selectedTicket.description,
        priority: selectedTicket.priority,
        status: selectedTicket.status,
      });
    }
  }, [selectedTicket]);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleChange = (e) => {
    setEditedTicket({
      ...editedTicket,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = async () => {
    try {
      await dispatch(
        updateTicket({ id: ticketId, ticketData: editedTicket })
      ).unwrap();
      setUpdateSuccess(true);
      setOpenEdit(false);
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to update ticket");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await dispatch(deleteTicket(ticketId)).unwrap();
        navigate("/admin/dashboard");
      } catch (err) {
        setError(err.message || "Failed to delete ticket");
      }
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedTicket) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Ticket not found
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <AdminHeader />
      <Container maxWidth="MD">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4">Ticket Details</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenEdit}
                sx={{ mr: 2 }}
              >
                Update Status
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Title
            </Typography>
            <Typography variant="h6">{selectedTicket.title}</Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Description
            </Typography>
            <Typography>{selectedTicket.description}</Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Status
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {selectedTicket.status.replace("_", " ")}
            </Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Priority
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {selectedTicket.priority}
            </Typography>
          </Box>

          <Dialog
            open={openEdit}
            onClose={handleCloseEdit}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Update Status</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editedTicket?.status || ""}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button
                onClick={handleUpdate}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={updateSuccess}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success">Ticket updated successfully!</Alert>
          </Snackbar>
        </Paper>
      </Container>
    </>
  );
}

export default AdminTicketDetail;
