import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/states/reducer.js";
import usersReducer from "./features/users/states/reducer.js";
import lostFoundsReducer from "./features/lost-founds/states/reducer.js";

export const store = configureStore({
  reducer: { auth: authReducer, users: usersReducer, lostFounds: lostFoundsReducer },
});
