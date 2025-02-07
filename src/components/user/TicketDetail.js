import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTicket,
  fetchSingleTicket,
  updateTicket,
} from "../../api/ticket";
import {
  Container,
  Typography,
  Snackbar,
  CircularProgress,
  Alert,
  Box,
  Paper,
  DialogActions,
  InputLabel,
  Select,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Button,
  FormControl,
  MenuItem,
} from "@mui/material";
import UserHeader from "../shared/user/UserHeader.";
import { styled } from "@mui/material/styles";
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  padding: theme.spacing(1, 3),
}));

function TicketDetail() {
  const { selectedTicket, loading } = useSelector((state) => state.ticket);
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const [editedTicket, setEditedTicket] = useState(null);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleTicket(ticketId));
  }, [ticketId, dispatch]);

  useEffect(() => {
    if (selectedTicket) {
      setEditedTicket({
        title: selectedTicket.title,
        description: selectedTicket.description,
        priority: selectedTicket.priority,
      });
    }
  }, [selectedTicket]);
  if (!selectedTicket && !deleteSuccess) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Ticket not found
        </Alert>
      </Container>
    );
  }

  if (loading || localLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }
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
        setLocalLoading(true);
        await dispatch(deleteTicket(ticketId)).unwrap();
        setDeleteSuccess(true);
        navigate("/user/dashboard", { replace: true });
      } catch (err) {
        setError(err.message || "Failed to delete ticket");
        setLocalLoading(false);
      }
    }
  };

  const isTicketEditable =
    selectedTicket && selectedTicket.status !== "resolved";

  return (
    <>
      {" "}
      <UserHeader />
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold">
              Ticket Detail
            </Typography>
            {selectedTicket?.status !== "resolved" && (
              <Box>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenEdit(true)}
                  sx={{ mr: 2 }}
                >
                  Edit
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </StyledButton>
              </Box>
            )}
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Title
            </Typography>

            <Typography variant="h6">{selectedTicket.title}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Description
            </Typography>
            <Typography>{selectedTicket.description}</Typography>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Status
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {selectedTicket.status.replace("_", " ")}
            </Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
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
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editedTicket?.title || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editedTicket?.description || ""}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={editedTicket?.priority || ""}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
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

          {/* Success Snackbars */}
          <Snackbar
            open={updateSuccess}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success">Ticket updated successfully!</Alert>
          </Snackbar>

          <Snackbar
            open={deleteSuccess}
            autoHideDuration={1500}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success">Ticket deleted successfully!</Alert>
          </Snackbar>
        </StyledPaper>
      </Container>
    </>
  );
}

export default TicketDetail;
