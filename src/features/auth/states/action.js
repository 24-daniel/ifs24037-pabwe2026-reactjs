import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/authApi.js";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper.js";

export const asyncLogin = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.login(email, password);
    putAccessToken(res.data.token);
    return true;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const asyncRegister = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    await api.register(name, email, password);
    return true;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const asyncLogout = createAsyncThunk("auth/logout", async () => {
  removeAccessToken();
  return true;
});
