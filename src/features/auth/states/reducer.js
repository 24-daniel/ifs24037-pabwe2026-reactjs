import { createSlice } from "@reduxjs/toolkit";
import { asyncLogin, asyncRegister, asyncLogout } from "./action.js";

const initialState = { isAuthLogin: false, isAuthRegister: false, isAuthLogout: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { resetAuth: () => initialState },
  extraReducers: (b) => {
    b.addCase(asyncLogin.fulfilled, (s) => { s.isAuthLogin = true; s.isAuthLogout = false; });
    b.addCase(asyncLogin.rejected, (s) => { s.isAuthLogin = false; });
    b.addCase(asyncRegister.fulfilled, (s) => { s.isAuthRegister = true; });
    b.addCase(asyncRegister.rejected, (s) => { s.isAuthRegister = false; });
    b.addCase(asyncLogout.fulfilled, () => ({ ...initialState, isAuthLogout: true }));
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
