import { createSlice } from "@reduxjs/toolkit";
import {
  createTicket,
  deleteTicket,
  fetchSingleTicket,
  fetchTickets,
  updateTicket,
} from "../api/ticket";

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
    selectedTicket: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchSingleTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket.id !== action.payload
        );
        state.selectedTicket = null;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default ticketSlice.reducer;
