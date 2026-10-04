import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.jsx";
import UsersPage from "./UsersPage.jsx";
import * as api from "../api/userApi.js";

vi.mock("../api/userApi.js");

describe("UsersPage", () => {
  beforeEach(() => vi.resetAllMocks());

  it("lists users and searches", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [{ id: "1", name: "Ani", email: "a@b.c" }] } });
    renderWithProviders(<UsersPage />);
    await waitFor(() => expect(screen.getByText("Ani")).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText("Cari pengguna"), "an");
    await waitFor(() => expect(api.getUsers).toHaveBeenLastCalledWith("an"));
  });

  it("shows empty state", async () => {
    api.getUsers.mockResolvedValue({ data: { users: [] } });
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("Tidak ada pengguna.")).toBeInTheDocument();
  });
});
