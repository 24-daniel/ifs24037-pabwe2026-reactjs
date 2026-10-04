import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../../test-utils.jsx";
import LoginPage from "./LoginPage.jsx";
import * as api from "../api/authApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/authApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const ui = (
  <Routes>
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<p>register page</p>} />
    <Route path="/" element={<p>home</p>} />
  </Routes>
);

describe("LoginPage", () => {
  beforeEach(() => { vi.resetAllMocks(); localStorage.clear(); });

  it("warns when empty", async () => {
    renderWithProviders(ui, { route: "/auth/login" });
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("logs in and goes home", async () => {
    api.login.mockResolvedValue({ data: { token: "t" } });
    renderWithProviders(ui, { route: "/auth/login" });
    await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument());
    expect(tools.showSuccessToast).toHaveBeenCalled();
  });

  it("shows error message and default message", async () => {
    api.login.mockRejectedValueOnce(new Error("salah"));
    renderWithProviders(ui, { route: "/auth/login" });
    await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("salah"));
  });

  it("falls back to default error text", async () => {
    api.login.mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    renderWithProviders(ui, { route: "/auth/login" });
    await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Login gagal"));
  });

  it("links to register", async () => {
    renderWithProviders(ui, { route: "/auth/login" });
    await userEvent.click(screen.getByRole("link", { name: "Daftar" }));
    expect(screen.getByText("register page")).toBeInTheDocument();
  });
});
