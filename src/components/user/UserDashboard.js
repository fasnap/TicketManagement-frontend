import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchTickets } from "../../api/ticket";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LogoutButton from "./LogoutButton";
import UserHeader from "../shared/user/UserHeader.";
function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading } = useSelector((state) => state.ticket);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });
  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }
    if (tickets.length === 0) {
      dispatch(fetchTickets(filters));
    }
  }, [user, dispatch, navigate, tickets.length, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <UserHeader />
      <Container sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Your Tickets
          </Typography>
          <Link to="/user/ticket/create">
            <Button variant="contained" color="primary">
              + Create Ticket
            </Button>
          </Link>
        </Box>
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
          mb={3}
          p={2}
          bgcolor="#f5f5f5"
          borderRadius={2}
        >
          <InputLabel>Status</InputLabel>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          <InputLabel>Priority</InputLabel>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              shrink
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : tickets.length === 0 ? (
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="text.secondary">
              No tickets found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tickets.map((ticket) => (
              <Grid item key={ticket.id} xs={12} sm={6} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {ticket.title}
                  </Typography>
                  <Typography color="text.secondary">
                    Status: {ticket.status}
                  </Typography>
                  <Typography color="text.secondary">
                    Priority: {ticket.priority}
                  </Typography>
                  <Box mt={2}>
                    <Link to={`/user/ticket/${ticket.id}`}>
                      <Button variant="outlined" color="primary" fullWidth>
                        View Details
                      </Button>
                    </Link>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default UserDashboard;
