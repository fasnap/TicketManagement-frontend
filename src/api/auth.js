import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosinstance";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    console.log("userdsta in api.js", userData)
    try {
      const response = await axiosInstance.post("user/register/", userData);
      console.log("response after aapi call",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log(credentials);
      const response = await axiosInstance.post("user/login/", credentials);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
