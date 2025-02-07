import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosinstance";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("admin/login/", credentials);
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );