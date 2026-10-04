import { createSlice } from "@reduxjs/toolkit";
import {
  asyncGetUsers, asyncGetProfile, asyncChangeProfile,
  asyncChangeProfilePhoto, asyncChangeProfilePassword,
} from "./action.js";

const initialState = {
  users: [], user: null, profile: null, isProfile: false,
  isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers: () => initialState,
    resetUserFlags: (s) => {
      s.isChangeProfile = false; s.isChangeProfilePhoto = false; s.isChangeProfilePassword = false;
    },
  },
  extraReducers: (b) => {
    b.addCase(asyncGetUsers.fulfilled, (s, a) => { s.users = a.payload; });
    b.addCase(asyncGetProfile.fulfilled, (s, a) => { s.profile = a.payload; s.user = a.payload; s.isProfile = true; });
    b.addCase(asyncGetProfile.rejected, (s) => { s.profile = null; s.isProfile = false; });
    b.addCase(asyncChangeProfile.fulfilled, (s) => { s.isChangeProfile = true; });
    b.addCase(asyncChangeProfilePhoto.fulfilled, (s) => { s.isChangeProfilePhoto = true; });
    b.addCase(asyncChangeProfilePassword.fulfilled, (s) => { s.isChangeProfilePassword = true; });
  },
});

export const { resetUsers, resetUserFlags } = usersSlice.actions;
export default usersSlice.reducer;
