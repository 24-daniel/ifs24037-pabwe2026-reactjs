import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/lostFoundApi.js";

const wrap = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const asyncGetLostFounds = wrap("lostFounds/list", async (filters) => (await api.getLostFounds(filters)).data.lost_founds);
export const asyncGetLostFound = wrap("lostFounds/detail", async (id) => (await api.getLostFound(id)).data.lost_found);
export const asyncAddLostFound = wrap("lostFounds/add", async (d) => { await api.addLostFound(d); return true; });
export const asyncChangeLostFound = wrap("lostFounds/change", async ({ id, ...d }) => { await api.changeLostFound(id, d); return true; });
export const asyncChangeCover = wrap("lostFounds/cover", async ({ id, file }) => { await api.changeCover(id, file); return true; });
export const asyncDeleteLostFound = wrap("lostFounds/delete", async (id) => { await api.deleteLostFound(id); return true; });
export const asyncGetStats = wrap("lostFounds/stats", async () => {
  const [daily, monthly] = await Promise.all([api.getDailyStats(), api.getMonthlyStats()]);
  return { daily: daily.data, monthly: monthly.data };
});
