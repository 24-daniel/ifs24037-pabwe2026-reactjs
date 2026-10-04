import { createSlice } from "@reduxjs/toolkit";
import * as A from "./action.js";

const initialState = {
  lostFounds: [], lostFound: null, isLostFound: false, lostFoundStats: null,
  isLostFoundAdd: false, isLostFoundAdded: false,
  isLostFoundChange: false, isLostFoundChanged: false,
  isLostFoundChangeCover: false, isLostFoundChangedCover: false,
  isLostFoundDelete: false, isLostFoundDeleted: false,
};

const mutations = [
  [A.asyncAddLostFound, "isLostFoundAdd", "isLostFoundAdded"],
  [A.asyncChangeLostFound, "isLostFoundChange", "isLostFoundChanged"],
  [A.asyncChangeCover, "isLostFoundChangeCover", "isLostFoundChangedCover"],
  [A.asyncDeleteLostFound, "isLostFoundDelete", "isLostFoundDeleted"],
];

const slice = createSlice({
  name: "lostFounds",
  initialState,
  reducers: {
    resetLostFounds: () => initialState,
    resetLostFoundFlags: (s) => ({
      ...initialState, lostFounds: s.lostFounds, lostFound: s.lostFound,
      isLostFound: s.isLostFound, lostFoundStats: s.lostFoundStats,
    }),
  },
  extraReducers: (b) => {
    b.addCase(A.asyncGetLostFounds.fulfilled, (s, a) => { s.lostFounds = a.payload; });
    b.addCase(A.asyncGetLostFound.fulfilled, (s, a) => { s.lostFound = a.payload; s.isLostFound = true; });
    b.addCase(A.asyncGetLostFound.rejected, (s) => { s.lostFound = null; s.isLostFound = false; });
    b.addCase(A.asyncGetStats.fulfilled, (s, a) => { s.lostFoundStats = a.payload; });
    mutations.forEach(([thunk, pending, done]) => {
      b.addCase(thunk.pending, (s) => { s[pending] = true; s[done] = false; });
      b.addCase(thunk.fulfilled, (s) => { s[pending] = false; s[done] = true; });
      b.addCase(thunk.rejected, (s) => { s[pending] = false; s[done] = false; });
    });
  },
});

export const { resetLostFounds, resetLostFoundFlags } = slice.actions;
export default slice.reducer;
