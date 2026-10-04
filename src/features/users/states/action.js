import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/userApi.js";

const wrap = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const asyncGetUsers = wrap("users/list", async (s) => (await api.getUsers(s)).data.users);
export const asyncGetProfile = wrap("users/me", async () => (await api.getMe()).data.user);
export const asyncChangeProfile = wrap("users/changeProfile", async ({ name, email }) => {
  await api.updateMe(name, email);
  return true;
});
export const asyncChangeProfilePhoto = wrap("users/changePhoto", async (file) => {
  await api.uploadPhoto(file);
  return true;
});
export const asyncChangeProfilePassword = wrap("users/changePassword", async ({ password, newPassword }) => {
  await api.changePassword(password, newPassword);
  return true;
});
