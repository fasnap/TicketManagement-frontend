import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosinstance";

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async ({ status, priority, user }, { rejectWithValue }) => {
    try {
      const params = {};
      const response = await axiosInstance.get("/ticket", {
        params: {
          status,
          priority,
          user,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchSingleTicket = createAsyncThunk(
  "tickets/fetchSingleTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/ticket/${ticketId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticket, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ticket/", ticket);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/ticket/${id}/`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/ticket/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
