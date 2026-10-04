import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils.jsx";
import App from "./App.jsx";
import * as users from "./features/users/api/userApi.js";
import * as lf from "./features/lost-founds/api/lostFoundApi.js";

vi.mock("./features/users/api/userApi.js");
vi.mock("./features/lost-founds/api/lostFoundApi.js");

describe("App routing", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    users.getMe.mockResolvedValue({ data: { user: { id: "1", name: "Ani", email: "a@b.c" } } });
    users.getUsers.mockResolvedValue({ data: { users: [] } });
    lf.getLostFounds.mockResolvedValue({ data: { lost_founds: [] } });
    lf.getDailyStats.mockResolvedValue({ data: [] });
    lf.getMonthlyStats.mockResolvedValue({ data: [] });
    lf.getLostFound.mockResolvedValue({ data: { lost_found: { id: "7", title: "Tas", description: "d", status: "lost", is_completed: 0, created_at: "2026-01-01T00:00:00Z" } } });
  });

  it("shows login and register when logged out", async () => {
    renderWithProviders(<App />, { route: "/auth/login" });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("lazy-loads register page", async () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    expect(await screen.findByRole("heading", { name: "Daftar" })).toBeInTheDocument();
  });

  it("guards protected routes", async () => {
    renderWithProviders(<App />, { route: "/users" });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it.each([
    ["/", "Dashboard Lost & Founds"],
    ["/users", "Daftar Pengguna"],
    ["/profile", "Profil Saya"],
    ["/lost-founds/7", "Tas"],
  ])("renders protected route %s", async (route, heading) => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(<App />, { route });
    expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("redirects unknown paths home", async () => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(<App />, { route: "/tidak-ada" });
    await waitFor(() => expect(screen.getByRole("heading", { name: "Dashboard Lost & Founds" })).toBeInTheDocument());
  });
});
