import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/states/reducer.js";
import usersReducer from "./features/users/states/reducer.js";
import lostFoundsReducer from "./features/lost-founds/states/reducer.js";

const rootReducer = combineReducers({ auth: authReducer, users: usersReducer, lostFounds: lostFoundsReducer });

export function makeStore(preloadedState) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export function renderWithProviders(ui, { preloadedState, route = "/" } = {}) {
  const store = makeStore(preloadedState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  };
}
