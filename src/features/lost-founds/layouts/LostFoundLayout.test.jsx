import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../../test-utils.jsx";
import LostFoundLayout from "./LostFoundLayout.jsx";
import * as api from "../../users/api/userApi.js";

vi.mock("../../users/api/userApi.js");

const ui = (
  <Routes>
    <Route path="/" element={<LostFoundLayout />}><Route index element={<p>content</p>} /></Route>
    <Route path="/auth/login" element={<p>login page</p>} />
  </Routes>
);

describe("LostFoundLayout", () => {
  beforeEach(() => { vi.resetAllMocks(); localStorage.clear(); });

  it("redirects to login without token", async () => {
    renderWithProviders(ui);
    await waitFor(() => expect(screen.getByText("login page")).toBeInTheDocument());
  });

  it("redirects when profile fails", async () => {
    localStorage.setItem("accessToken", "t");
    api.getMe.mockRejectedValue(new Error("x"));
    renderWithProviders(ui);
    await waitFor(() => expect(screen.getByText("login page")).toBeInTheDocument());
  });

  it("renders content and opens/closes drawer", async () => {
    localStorage.setItem("accessToken", "t");
    api.getMe.mockResolvedValue({ data: { user: { id: "1", name: "Ani", email: "a@b.c" } } });
    renderWithProviders(ui);
    expect(await screen.findByText("content")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Buka menu"));
    await userEvent.click(screen.getByTestId("backdrop"));
    expect(screen.queryByTestId("backdrop")).toBeNull();
  });
});
