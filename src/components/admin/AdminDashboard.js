import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTickets } from "../../api/ticket";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import LogoutButton from "./LogoutButton";
import AdminHeader from "../shared/admin/AdminHeader";

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading } = useSelector((state) => state.ticket);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    user: "",
  });
  useEffect(() => {
    if (!user || user?.role !== "admin") {
      navigate("/admin/login");
      return;
    }
    if (tickets.length === 0) {
      dispatch(fetchTickets(filters));
    }
  }, [user, dispatch, navigate, tickets.length, filters]);

  const handleViewTicket = (ticketId) => {
    navigate(`/admin/ticket/${ticketId}`);
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <AdminHeader />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography sx={{ mb: 4 }} variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ mb: 6 }}>
          <FormControl sx={{ minWidth: 100, maxWidth: 100, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100, maxWidth: 100, mr: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="user"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            sx={{ mr: 2, minWidth: 100, maxWidth: 100 }}
          />
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 2, borderRadius: 2 }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.description}</TableCell>

                    <TableCell>
                      <Chip
                        label={ticket.status}
                        sx={{
                          backgroundColor:
                            ticket.status === "open"
                              ? "gray"
                              : ticket.status === "in_progress"
                              ? "orange"
                              : "green",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        sx={{
                          backgroundColor:
                            ticket.priority === "high"
                              ? "red"
                              : ticket.priority === "low"
                              ? "black"
                              : "brown",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>{ticket.username}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#1565c0",
                          "&:hover": { backgroundColor: "#0d47a1" },
                        }}
                        onClick={() => handleViewTicket(ticket.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default AdminDashboard;
