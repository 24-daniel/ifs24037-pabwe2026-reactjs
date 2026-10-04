import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../../../test-utils.jsx";
import RegisterPage from "./RegisterPage.jsx";
import * as api from "../api/authApi.js";
import * as tools from "../../../helpers/toolsHelper.js";

vi.mock("../api/authApi.js");
vi.mock("../../../helpers/toolsHelper.js");

const ui = (
  <Routes>
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/auth/login" element={<p>login page</p>} />
  </Routes>
);

const fill = async (pw = "secret1") => {
  await userEvent.type(screen.getByLabelText("Nama"), "Dan");
  await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
  await userEvent.type(screen.getByLabelText("Kata sandi"), pw);
};

describe("RegisterPage", () => {
  beforeEach(() => vi.resetAllMocks());

  it("validates input", async () => {
    renderWithProviders(ui, { route: "/auth/register" });
    await fill("123");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(tools.showWarningDialog).toHaveBeenCalled();
  });

  it("registers and goes to login", async () => {
    api.register.mockResolvedValue({});
    renderWithProviders(ui, { route: "/auth/register" });
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(screen.getByText("login page")).toBeInTheDocument());
  });

  it("shows error and default error", async () => {
    api.register.mockRejectedValueOnce(new Error("dobel"));
    renderWithProviders(ui, { route: "/auth/register" });
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("dobel"));
  });

  it("falls back to default error text", async () => {
    api.register.mockRejectedValueOnce(Object.assign(new Error(), { message: undefined }));
    renderWithProviders(ui, { route: "/auth/register" });
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(tools.showErrorDialog).toHaveBeenCalledWith("Registrasi gagal"));
  });

  it("links to login", async () => {
    renderWithProviders(ui, { route: "/auth/register" });
    await userEvent.click(screen.getByRole("link", { name: "Masuk" }));
    expect(screen.getByText("login page")).toBeInTheDocument();
  });
});
