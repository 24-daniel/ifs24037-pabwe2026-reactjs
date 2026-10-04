import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../../test-utils.jsx";
import NavbarComponent from "./NavbarComponent.jsx";

const profile = (p) => ({ preloadedState: { users: { users: [], user: p, profile: p, isProfile: true,
  isChangeProfile: false, isChangeProfilePhoto: false, isChangeProfilePassword: false } } });
const ui = (onMenu = () => {}) => (
  <Routes>
    <Route path="/" element={<NavbarComponent onMenu={onMenu} />} />
    <Route path="/auth/login" element={<p>login page</p>} />
  </Routes>
);

describe("NavbarComponent", () => {
  it("shows photo avatar, toggles dropdown and calls onMenu", async () => {
    const onMenu = vi.fn();
    renderWithProviders(ui(onMenu), profile({ id: "1", name: "Ani", email: "a@b.c", photo: "p.png" }));
    expect(screen.getByAltText("avatar")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Buka menu"));
    expect(onMenu).toHaveBeenCalled();
    await userEvent.click(screen.getByLabelText("Menu akun"));
    expect(screen.getByText("a@b.c")).toBeInTheDocument();
  });

  it("shows initial when no photo, and logs out", async () => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(ui(), profile({ id: "1", name: "Ani", email: "a@b.c" }));
    expect(screen.getByText("A")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Menu akun"));
    await userEvent.click(screen.getByRole("button", { name: /Keluar/ }));
    await waitFor(() => expect(screen.getByText("login page")).toBeInTheDocument());
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("shows placeholder without profile", () => {
    renderWithProviders(ui());
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
