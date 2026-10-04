import { describe, it, expect, beforeEach } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test-utils.jsx";
import AuthLayout from "./AuthLayout.jsx";

const ui = (
  <Routes>
    <Route path="/auth" element={<AuthLayout />}><Route path="login" element={<p>form</p>} /></Route>
    <Route path="/" element={<p>home</p>} />
  </Routes>
);

describe("AuthLayout", () => {
  beforeEach(() => localStorage.clear());
  it("renders outlet when logged out", () => {
    renderWithProviders(ui, { route: "/auth/login" });
    expect(screen.getByText("form")).toBeInTheDocument();
  });
  it("redirects home when token exists", () => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(ui, { route: "/auth/login" });
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
